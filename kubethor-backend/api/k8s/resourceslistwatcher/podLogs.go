package resourceslistwatcher

import (
	"context"
	"net/http"

	k8sclient "kubethor-backend/api"
	config "kubethor-backend/config"
	"time"

	"encoding/json"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	corev1 "k8s.io/api/core/v1"
)

type LogMessage struct {
	Timestamp string `json:"timestamp"`
	Log       string `json:"log"`
}

func WatchPodLogs(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("sessionId")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	// Retrieve user data using session ID
	userData, err := k8sclient.GetSession(sessionID) // Assuming GetSession is accessible in the same package
	if err != nil {
		// Handle error
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Upgrade the HTTP connection to a WebSocket connection.
	conn, err := config.WebSocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		// log.Printf("WebSocket upgrade error: %v", err)
		return
	}
	defer func() {
		conn.Close()
		// log.Println("Defer WS Conn Closed")
	}()

	vars := mux.Vars(r)
	namespace := vars["namespace_name"]
	podName := vars["pod_name"]
	containerName := vars["container_name"]

	// Define log options
	logOptions := &corev1.PodLogOptions{
		Container: containerName,
		Follow:    true, // Set to true to stream logs
	}

	// Create a pod log request
	req := userData.Clientset.CoreV1().Pods(namespace).GetLogs(podName, logOptions)

	// Create a context with a cancelation mechanism
	ctx, cancel := context.WithCancel(context.Background())
	defer func() {
		cancel()
		// log.Println("Context canceled")
	}()

	// Stream pod logs and send them over WebSocket
	podLog, err := req.Stream(ctx)
	if err != nil {
		// log.Printf("Error streaming pod logs: %v", err)
		return
	}
	defer podLog.Close()

	// Create a channel to signal the closure of the WebSocket connection
	stopCh := make(chan struct{})

	// Start a goroutine to check the WebSocket status
	go func() {
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				conn.Close()
				// log.Printf("WebSocket connection closed by the client: %v", err)
				podLog.Close() // Close the pod log stream
				// log.Println("WebSocket closed by client")
				cancel()
				// log.Println("Pod Log Stream closed")
				close(stopCh)
				return
			}
		}
	}()

	// Ping-Pong to keep the connection alive
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	go func() {
		for {
			select {
			case <-ticker.C:
				if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					close(stopCh)
					return
				}
			case <-stopCh:
				return
			}
		}
	}()

	for {
		buf := make([]byte, 1024)
		n, err := podLog.Read(buf)
		if err != nil {
			// log.Printf("Error reading pod logs: %v", err)
			break
		}

		// Create a LogMessage struct and populate it with data
		logMessage := LogMessage{
			Timestamp: time.Now().Format(time.RFC3339),
			Log:       string(buf[:n]),
		}

		// Marshal the LogMessage struct into JSON
		jsonData, err := json.Marshal(logMessage)
		if err != nil {
			// log.Printf("Error marshaling log message to JSON: %v", err)
			break
		}

		// Send the JSON-encoded log message over WebSocket
		if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
			// log.Printf("Error sending log message over WebSocket: %v", err)
			break
		}

		// The time.Sleep(100 * time.Millisecond) is used in the code to introduce a small delay between sending log messages over the WebSocket. The purpose of this sleep is to control the rate at which log messages are sent.
		// In some scenarios, especially when dealing with high log volumes or rapid log generation, sending log messages too quickly over the WebSocket can overwhelm the receiving end, such as a web browser or WebSocket client, causing performance issues or making it challenging to process the logs in real-time.
		time.Sleep(100 * time.Millisecond)
	}
}
