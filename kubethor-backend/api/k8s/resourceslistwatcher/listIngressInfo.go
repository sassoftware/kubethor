package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	networkingv1 "k8s.io/api/networking/v1"
)

// Custom struct to hold Config Map information
type IngressInfo struct {
	Name          string                     `json:"name"`
	Namespace     string                     `json:"namespace"`
	Age           string                     `json:"age"`
	LoadBalancers []string                   `json:"loadBalancers"`
	Rules         []networkingv1.IngressRule `json:"rules"`
	EventType     string                     `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListIngressInfo(data *networkingv1.Ingress, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(data.CreationTimestamp.Time).String()

	// Extract LoadBalancers
	loadBalancers := make([]string, len(data.Status.LoadBalancer.Ingress))
	for i, lb := range data.Status.LoadBalancer.Ingress {
		loadBalancers[i] = lb.IP
	}

	// Create a ConfigMapsInfo struct with the relevant data
	dataInfo := IngressInfo{
		Name:          data.Name,
		Namespace:     data.Namespace,
		Age:           age,
		LoadBalancers: loadBalancers,
		Rules:         data.Spec.Rules,
		EventType:     eventType,
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
