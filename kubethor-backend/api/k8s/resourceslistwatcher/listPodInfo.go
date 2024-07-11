package resourceslistwatcher

import (
	"encoding/json"
	"fmt"

	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Pod information
type PodInfo struct {
	Name           string                       `json:"name"`
	Namespace      string                       `json:"namespace"`
	Containers     map[string]map[string]string `json:"containers"`
	InitContainers map[string]map[string]string `json:"initContainers"`
	Restarts       int32                        `json:"restarts"`
	ControlledBy   string                       `json:"controlledBy"`
	Node           string                       `json:"node"`
	Qos            string                       `json:"qos"`
	Age            string                       `json:"age"`
	Status         string                       `json:"status"`
	StatusReason   string                       `json:"statusReason"`
	Labels         map[string]string            `json:"labels"`
	EventType      string                       `json:"eventType"`
}

// Process a Kubernetes Pod event and send data to the WebSocket client
func ListPodInfo(podData *corev1.Pod, eventType string) ([]byte, error) {
	// Calculate the age of the Pod
	age := time.Since(podData.CreationTimestamp.Time).String()

	// Extract container names and statuses
	containers := make(map[string]map[string]string)
	for _, containerStatus := range podData.Status.ContainerStatuses {
		containerName := containerStatus.Name
		// Extract the state of the init container
		containerState := ""
		containerStartedAt := ""
		containerStateReason := ""
		if containerStatus.State.Running != nil {
			containerState = "running"
			containerStartedAt = containerStatus.State.Running.StartedAt.String()
		} else if containerStatus.State.Waiting != nil {
			containerState = "waiting"
			containerStateReason = containerStatus.State.Waiting.Reason
		} else if containerStatus.State.Terminated != nil {
			containerState = "terminated"
			containerStartedAt = containerStatus.State.Terminated.StartedAt.String()
			containerStateReason = containerStatus.State.Terminated.Reason
		}
		container := map[string]string{
			"containerName":        containerName,
			"containerState":       containerState,
			"containerStateReason": containerStateReason,
			"containerStartedAt":   containerStartedAt,
		}
		containers[containerName] = container
	}

	// Extract init container names and statuses
	initContainers := make(map[string]map[string]string)
	for _, containerStatus := range podData.Status.InitContainerStatuses {
		containerName := containerStatus.Name
		// Extract the state of the init container
		containerState := ""
		if containerStatus.State.Running != nil {
			containerState = "running"
		} else if containerStatus.State.Waiting != nil {
			containerState = "waiting"
		} else if containerStatus.State.Terminated != nil {
			containerState = "terminated"
		}
		container := map[string]string{
			"containerName":  containerName,
			"containerState": containerState,
		}
		initContainers[containerName] = container
	}

	// Extract controlled by information
	controlledBy := ""
	if len(podData.OwnerReferences) > 0 {
		controlledBy = podData.OwnerReferences[0].Name
	}

	// Extract the node name
	node := podData.Spec.NodeName

	// Extract QoS class
	qos := string(podData.Status.QOSClass)

	// Extract labels
	labels := make(map[string]string)
	for key, value := range podData.Labels {
		labels[key] = value
	}

	// Extract Pod status
	podStatus := string(podData.Status.Phase)

	// Extract Pod status
	podStatusReason := string(podData.Status.Reason)

	// Create a PodInfo struct with the relevant data
	podInfo := PodInfo{
		Name:           podData.Name,
		Namespace:      podData.Namespace,
		Containers:     containers,
		InitContainers: initContainers,
		ControlledBy:   controlledBy,
		Node:           node,
		Qos:            qos,
		Age:            age,
		Status:         podStatus,
		StatusReason:   podStatusReason,
		Labels:         labels,
		EventType:      eventType,
	}

	// Check if there are container statuses available
	if len(podData.Status.ContainerStatuses) > 0 {
		// Access the first container status if available
		podInfo.Restarts = podData.Status.ContainerStatuses[0].RestartCount
		// Use podInfo.Restarts as needed
	} else {
		// Set a default value (e.g., 0) when there are no container statuses
		podInfo.Restarts = 0
	}

	// Marshal the PodInfo struct into JSON
	podJSON, err := json.Marshal(podInfo)
	if err != nil {
		// Handle the error (e.g., log or return an error)
		fmt.Println("Error marshaling podInfo to JSON:", err)
		return nil, err
	}

	return podJSON, nil
}
