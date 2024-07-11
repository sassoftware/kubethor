package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	config "kubethor-backend/config"

	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	"k8s.io/apimachinery/pkg/watch"
)

func processEvent(event watch.Event, resourceType string) ([]byte, error) {
	var respJSON []byte
	var err error

	switch resourceType {
	case "Pod":
		podData, ok := event.Object.(*corev1.Pod)
		if !ok {
			return nil, fmt.Errorf("invalid Pod event")
		}
		respJSON, err = ListPodInfo(podData, string(event.Type))
	case "Deployment":
		deploymentData, ok := event.Object.(*appsv1.Deployment)
		if !ok {
			return nil, fmt.Errorf("invalid Deployment event")
		}
		respJSON, err = ListDeploymentInfo(deploymentData, string(event.Type))
	case "ConfigMap":
		configMapsData, ok := event.Object.(*corev1.ConfigMap)
		if !ok {
			return nil, fmt.Errorf("invalid ConfigMap event")
		}
		respJSON, err = ListConfigMapsInfo(configMapsData, string(event.Type))
	case "Job":
		jobsData, ok := event.Object.(*batchv1.Job)
		if !ok {
			return nil, fmt.Errorf("invalid Job event")
		}
		respJSON, err = ListJobInfo(jobsData, string(event.Type))
	case "Service":
		serviceData, ok := event.Object.(*corev1.Service)
		if !ok {
			return nil, fmt.Errorf("invalid Service event")
		}
		respJSON, err = ListServiceInfo(serviceData, string(event.Type))
	case "Secret":
		secretsData, ok := event.Object.(*corev1.Secret)
		if !ok {
			return nil, fmt.Errorf("invalid secrets event")
		}
		respJSON, err = ListSecretsInfo(secretsData, string(event.Type))
	case "HorizontalPodAutoscaler":
		hpaData, ok := event.Object.(*autoscalingv1.HorizontalPodAutoscaler)
		if !ok {
			return nil, fmt.Errorf("invalid HorizontalPodAutoscaler event")
		}
		respJSON, err = ListHPAInfo(hpaData, string(event.Type))
	case "Ingress":
		ingressData, ok := event.Object.(*networkingv1.Ingress)
		if !ok {
			return nil, fmt.Errorf("invalid Ingress event")
		}
		respJSON, err = ListIngressInfo(ingressData, string(event.Type))
	case "Endpoints":
		endpointData, ok := event.Object.(*corev1.Endpoints)
		if !ok {
			return nil, fmt.Errorf("invalid Endpoints event")
		}
		respJSON, err = ListEndpointsInfo(endpointData, string(event.Type))
	case "ServiceAccount":
		serviceaccountData, ok := event.Object.(*corev1.ServiceAccount)
		if !ok {
			return nil, fmt.Errorf("invalid ServiceAccount event")
		}
		respJSON, err = ListServiceAccountInfo(serviceaccountData, string(event.Type))
	case "PersistentVolumeClaim":
		persistentVolumeClaimData, ok := event.Object.(*corev1.PersistentVolumeClaim)
		if !ok {
			return nil, fmt.Errorf("invalid PersistentVolumeClaim event")
		}
		respJSON, err = ListPersistentVolumeClaimInfo(persistentVolumeClaimData, string(event.Type))
	case "Namespace":
		namespaceData, ok := event.Object.(*corev1.Namespace)
		if !ok {
			return nil, fmt.Errorf("invalid Namespace event")
		}
		respJSON, err = ListNamespaceInfo(namespaceData, string(event.Type))
	case "Node":
		nodeData, ok := event.Object.(*corev1.Node)
		if !ok {
			return nil, fmt.Errorf("invalid Node event")
		}
		respJSON, err = ListNodeInfo(nodeData, string(event.Type))
	case "Event":
		eventData, ok := event.Object.(*corev1.Event)
		if !ok {
			return nil, fmt.Errorf("invalid Events event")
		}
		respJSON, err = ListEventInfo(eventData, string(event.Type))

	default:
		return nil, fmt.Errorf("unsupported resource type")
	}

	if err != nil {
		// Handle the error (e.g., log or close the connection)
		// log.Printf("Error processing %s event: %v\n", resourceType, err)
		return nil, err
	}

	return respJSON, nil
}

func ListResources(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("sessionId")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	resourceType := vars["resource_type"]

	if namespaceName == "" || resourceType == "" {
		http.Error(w, "Namespace and Resource Type must be provided", http.StatusBadRequest)
		return
	}

	// Get the remote machine's IP address and check for an existing WebSocket connection
	// ip, err := getCheckClientIPAddress(w, r)
	// if err != nil {
	// 	// An existing WebSocket connection was found, and an error response was sent
	// 	return
	// }

	conn, err := config.WebSocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade connection to WebSocket", http.StatusInternalServerError)
		return
	}
	defer func() {
		conn.Close()
		// fmt.Println("Websocket Conn Closed")
	}()

	// Indicate WebSocket connection is established
	// fmt.Println("WebSocket Connection Established")

	// Start watching resources and send updates to the client
	stopCh := make(chan struct{})
	eventsCh, err := K8sWatchResources(sessionID, namespaceName, resourceType, stopCh)
	if err != nil {
		errMsg := ErrorMessage{Error: fmt.Sprintf("Resource: %s for Namspace: %s - %s", resourceType, namespaceName, err)}
		errMsgJSON, errJ := json.Marshal(errMsg)
		if errJ != nil {
			// Handle the error when marshaling the JSON.
			return
		}
		// fmt.Println(errMsgJSON)
		time.Sleep(100 * time.Millisecond)
		conn.WriteMessage(websocket.TextMessage, []byte(errMsgJSON))
		return
	}
	// defer close(stopCh) // Stop the watcher when the client disconnects // Not using this because it is slow after websocket closed

	// Store the WebSocket connection for this machine
	// machineConnections[ip] = conn

	// Handle WebSocket disconnection
	go func() {
		_, _, err := conn.ReadMessage()
		if err != nil {
			// WebSocket disconnected, stop the watcher
			close(stopCh)
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

	// Send updates to the client
	for event := range eventsCh {
		var respJSON []byte

		if event.Type == watch.Error {
			// Handle error event, if needed
			errMsg := ErrorMessage{
				Error: "K8s Watcher Pod Event Error Occurred",
			}
			// Convert the error message to JSON
			respJSON, _ = json.Marshal(errMsg)
		} else if event.Type != "" && event.Object != nil {
			// Check if the event has a non-empty type and a non-nil object - watch.Event{Type:"", Object:runtime.Object(nil)}
			// You can send the event data to the client using conn.WriteMessage or a similar method.
			// Make sure to handle different types of events (e.g., Added, Modified, Deleted) as needed.
			// Convert Resource Data to JSON
			respJSON, err = processEvent(event, resourceType)
			if err != nil {
				// Handle the error (e.g., log or close the connection)
				log.Println("Error processing event:", err)
				continue
			}
		}

		// Send the JSON data to the client only if respJSON is not empty
		if len(respJSON) > 0 {
			// Send the JSON data to the client
			err = conn.WriteMessage(websocket.TextMessage, respJSON)
			if err != nil {
				// Error occurred while sending data, handle it (e.g., log or close the connection)
				// log.Println("Error sending JSON data to machine:", err)
				break
			}
			// The time.Sleep(100 * time.Millisecond) is used in the code to introduce a small delay between sending log messages over the WebSocket. The purpose of this sleep is to control the rate at which log messages are sent.
			// In some scenarios, especially when dealing with high log volumes or rapid log generation, sending log messages too quickly over the WebSocket can overwhelm the receiving end, such as a web browser or WebSocket client, causing performance issues or making it challenging to process the logs in real-time.
			time.Sleep(100 * time.Millisecond)
		}
	}

	// WebSocket disconnected, stop the watcher (if not already stopped)
	// fmt.Println("WebSocket disconnected for machine:")

	// Remove the WebSocket connection when it's closed
	// delete(machineConnections, ip)
}
