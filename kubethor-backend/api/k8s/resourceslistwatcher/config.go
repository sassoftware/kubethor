package resourceslistwatcher

import (
	"context"
	"errors"
	"fmt"
	k8sclient "kubethor-backend/api"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

var machineConnections = make(map[string]*websocket.Conn)

type ErrorMessage struct {
	Error    string `json:"error"`
	K8sError string `json:"k8sError,omitempty"`
}

// Get the remote machine's IP address and check for an existing WebSocket connection
func getCheckClientIPAddress(w http.ResponseWriter, r *http.Request) (string, error) {
	// Get the remote machine's IP address
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}

	// Check if the machine already has a WebSocket connection
	if _, exists := machineConnections[ip]; exists {
		http.Error(w, "Already connected", http.StatusForbidden)
		return "", errors.New("already connected")
	}

	return ip, nil
}

// WatchResources watches for changes to resources of a specific type.
func K8sWatchResources(sessionID, namespace, resourceType string, stopCh <-chan struct{}) (<-chan watch.Event, error) {
	// Retrieve user data using session ID
	userData, err := k8sclient.GetSession(sessionID)
	if err != nil {
		return nil, err
	}

	// Check if clientset is properly initialized
	if userData.Clientset == nil {
		return nil, fmt.Errorf("clientset is nil, clientset not properly initialized")
	}

	resourceWatch := func() (watch.Interface, error) {
		switch resourceType {
		case "Pod":
			return userData.Clientset.CoreV1().Pods(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Deployment":
			return userData.Clientset.AppsV1().Deployments(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "ConfigMap":
			return userData.Clientset.CoreV1().ConfigMaps(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Job":
			return userData.Clientset.BatchV1().Jobs(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Service":
			return userData.Clientset.CoreV1().Services(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Secret":
			return userData.Clientset.CoreV1().Secrets(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "HorizontalPodAutoscaler":
			return userData.Clientset.AutoscalingV1().HorizontalPodAutoscalers(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Ingress":
			return userData.Clientset.NetworkingV1().Ingresses(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Endpoints":
			return userData.Clientset.CoreV1().Endpoints(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "ServiceAccount":
			return userData.Clientset.CoreV1().ServiceAccounts(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "PersistentVolumeClaim":
			return userData.Clientset.CoreV1().PersistentVolumeClaims(namespace).Watch(context.Background(), metav1.ListOptions{})
		case "Namespace":
			return userData.Clientset.CoreV1().Namespaces().Watch(context.Background(), metav1.ListOptions{})
		case "Node":
			return userData.Clientset.CoreV1().Nodes().Watch(context.Background(), metav1.ListOptions{})
		case "Event":
			return userData.Clientset.CoreV1().Events(namespace).Watch(context.Background(), metav1.ListOptions{})
			// Add cases for other resource types as needed
		default:
			return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
		}
	}

	watcher, err := resourceWatch()
	if err != nil {
		return nil, err
	}

	eventsCh := make(chan watch.Event)

	go K8sWatchEvents(watcher, stopCh, eventsCh)

	return eventsCh, nil
}

// WatchK8sEvents receives k8s events from the watcher and sends them to the channel.
func K8sWatchEvents(watcher watch.Interface, stopCh <-chan struct{}, eventsCh chan<- watch.Event) {
	defer close(eventsCh)
	watcherStopped := false // Flag to track whether the watcher has stopped
	for {
		select {
		case <-stopCh:
			if !watcherStopped {
				watcherStopped = true
				watcher.Stop()
			}
			return
		case event, ok := <-watcher.ResultChan():
			if !ok {
				eventsCh <- watch.Event{Type: watch.Error}
				return
			}
			eventsCh <- event
		}
	}
}
