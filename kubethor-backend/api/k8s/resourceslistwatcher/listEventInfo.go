package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Event information
type EventInfo struct {
	Name           string `json:"name"`
	Namespace      string `json:"namespace"`
	Age            string `json:"age"`
	EventType      string `json:"eventType"`
	Type           string `json:"type"`
	Message        string `json:"message"`
	InvolvedObject string `json:"involvedObject"`
	Source         string `json:"source"`
	Count          int32  `json:"count"`
	LastSeen       string `json:"lastSeen"`
}

// Process a Kubernetes Event and send data to the WebSocket client
func ListEventInfo(data *corev1.Event, eventType string) ([]byte, error) {
	// Calculate the age of the Event
	age := time.Since(data.CreationTimestamp.Time).String()
	lastSeen := time.Since(data.LastTimestamp.Time).String()

	// Create an EventInfo struct with the relevant data
	dataInfo := EventInfo{
		Name:           data.Name,
		Namespace:      data.Namespace,
		Age:            age,
		EventType:      eventType,
		Type:           string(data.Type),
		Message:        data.Message,
		InvolvedObject: fmt.Sprintf("%s/%s", data.InvolvedObject.Kind, data.InvolvedObject.Name),
		Source:         data.Source.Component,
		Count:          data.Count,
		LastSeen:       lastSeen,
	}

	// Marshal the EventInfo struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling Event Info to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
