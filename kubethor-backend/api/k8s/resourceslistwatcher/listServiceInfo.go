package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Service information
type ServiceInfo struct {
	Name        string               `json:"name"`
	Namespace   string               `json:"namespace"`
	Age         string               `json:"age"`
	Type        corev1.ServiceType   `json:"type"`
	ClusterIP   string               `json:"clusterIP"`
	Ports       []corev1.ServicePort `json:"ports"`
	ExternalIPs []string             `json:"externalIPs"`
	EventType   string               `json:"eventType"`
}

// ListServiceInfo processes a Kubernetes Service event and converts it to JSON format
func ListServiceInfo(data *corev1.Service, eventType string) ([]byte, error) {
	// Calculate the age of the Service
	age := time.Since(data.CreationTimestamp.Time).String()

	// Create a ServiceInfo struct with the relevant data
	dataInfo := ServiceInfo{
		Name:        data.Name,
		Namespace:   data.Namespace,
		Age:         age,
		Type:        data.Spec.Type,
		ClusterIP:   data.Spec.ClusterIP,
		Ports:       data.Spec.Ports,
		ExternalIPs: data.Spec.ExternalIPs,
		EventType:   eventType,
	}

	// Marshal the serviceJSON struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling serviceInfo to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
