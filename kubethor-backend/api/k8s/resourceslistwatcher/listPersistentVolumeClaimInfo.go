package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Config Map information
type PersistentVolumeClaimInfo struct {
	Name         string `json:"name"`
	Namespace    string `json:"namespace"`
	StorageClass string `json:"storageClass,omitempty"`
	Age          string `json:"age"`
	EventType    string `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListPersistentVolumeClaimInfo(data *corev1.PersistentVolumeClaim, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(data.CreationTimestamp.Time).String()

	// Create a ConfigMapsInfo struct with the relevant data
	dataInfo := PersistentVolumeClaimInfo{
		Name:         data.Name,
		Namespace:    data.Namespace,
		Age:          age,
		StorageClass: *data.Spec.StorageClassName,
		EventType:    eventType,
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
