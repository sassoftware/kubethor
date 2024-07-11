package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	autoscalingv1 "k8s.io/api/autoscaling/v1"
)

// Custom struct to hold HPA information
type HPAInfo struct {
	Name       string `json:"name"`
	Namespace  string `json:"namespace"`
	Age        string `json:"age"`
	EventType  string `json:"eventType"`
	MinPods    int32  `json:"minPods"`
	MaxPods    int32  `json:"maxPods"`
	Replicas   int32  `json:"replicas"`
	TargetKind string `json:"targetKind"`
	TargetName string `json:"targetName"`
}

// Process a Kubernetes HorizontalPodAutoscaler event and send data to the WebSocket client
func ListHPAInfo(data *autoscalingv1.HorizontalPodAutoscaler, eventType string) ([]byte, error) {
	// Calculate the age of the HorizontalPodAutoscaler
	age := time.Since(data.CreationTimestamp.Time).String()

	// Create an HPAInfo struct with the relevant data
	hpaInfo := HPAInfo{
		Name:       data.Name,
		Namespace:  data.Namespace,
		Age:        age,
		EventType:  eventType,
		MinPods:    *data.Spec.MinReplicas,
		MaxPods:    data.Spec.MaxReplicas,
		Replicas:   data.Status.CurrentReplicas,
		TargetKind: data.Spec.ScaleTargetRef.Kind,
		TargetName: data.Spec.ScaleTargetRef.Name,
	}

	// Marshal the HPAInfo struct into JSON
	hpaJSON, err := json.Marshal(hpaInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling HPA Info to JSON:", err)
		return nil, err
	}

	return hpaJSON, nil
}
