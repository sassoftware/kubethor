package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Config Map information
type NamespaceInfo struct {
	Name      string                 `json:"name"`
	Age       string                 `json:"age"`
	Status    corev1.NamespaceStatus `json:"status"`
	EventType string                 `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListNamespaceInfo(data *corev1.Namespace, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(data.CreationTimestamp.Time).String()

	// Create a ConfigMapsInfo struct with the relevant data
	dataInfo := NamespaceInfo{
		Name:      data.Name,
		Age:       age,
		Status:    data.Status,
		EventType: eventType,
	}

	// Marshal the DeploymentInfo struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling PersistentVolumeClaim Info to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
