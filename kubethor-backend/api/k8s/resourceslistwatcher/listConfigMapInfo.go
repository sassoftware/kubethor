package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Config Map information
type ConfigMapsInfo struct {
	Name      string   `json:"name"`
	Namespace string   `json:"namespace"`
	Age       string   `json:"age"`
	Keys      []string `json:"keys"`
	EventType string   `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListConfigMapsInfo(configMapsData *corev1.ConfigMap, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(configMapsData.CreationTimestamp.Time).String()

	// Extract the keys from the ConfigMap's data
	var keys []string
	for key := range configMapsData.Data {
		keys = append(keys, key)
	}

	// Create a ConfigMapsInfo struct with the relevant data
	configMapsInfo := ConfigMapsInfo{
		Name:      configMapsData.Name,
		Namespace: configMapsData.Namespace,
		Age:       age,
		Keys:      keys,
		EventType: eventType,
	}

	// Marshal the DeploymentInfo struct into JSON
	configMapsJSON, err := json.Marshal(configMapsInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling deploymentInfo to JSON:", err)
		return nil, err
	}

	return configMapsJSON, nil
}
