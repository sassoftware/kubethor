package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Config Map information
type EndpointsInfo struct {
	Name      string                  `json:"name"`
	Namespace string                  `json:"namespace"`
	Age       string                  `json:"age"`
	Subsets   []corev1.EndpointSubset `json:"subsets"`
	EventType string                  `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListEndpointsInfo(data *corev1.Endpoints, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(data.CreationTimestamp.Time).String()

	// Create a ConfigMapsInfo struct with the relevant data
	dataInfo := EndpointsInfo{
		Name:      data.Name,
		Namespace: data.Namespace,
		Age:       age,
		Subsets:   data.Subsets,
		EventType: eventType,
	}

	// Marshal the DeploymentInfo struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling Ingress Info to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
