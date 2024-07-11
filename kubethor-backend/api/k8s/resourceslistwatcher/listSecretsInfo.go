package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Config Map information
type SecretsInfo struct {
	Name      string   `json:"name"`
	Namespace string   `json:"namespace"`
	Age       string   `json:"age"`
	Keys      []string `json:"keys"`
	Type      string   `json:"type"`
	EventType string   `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListSecretsInfo(data *corev1.Secret, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(data.CreationTimestamp.Time).String()

	// Extract the keys from the ConfigMap's data
	var keys []string
	for key := range data.Data {
		keys = append(keys, key)
	}

	// Create a ConfigMapsInfo struct with the relevant data
	dataInfo := SecretsInfo{
		Name:      data.Name,
		Namespace: data.Namespace,
		Age:       age,
		Keys:      keys,
		Type:      string(data.Type),
		EventType: eventType,
	}

	// Marshal the DeploymentInfo struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling deploymentInfo to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
