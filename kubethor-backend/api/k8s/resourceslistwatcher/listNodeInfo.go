package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	corev1 "k8s.io/api/core/v1"
)

// Custom struct to hold Node information
type NodeInfo struct {
	Name      string   `json:"name"`
	Age       string   `json:"age"`
	EventType string   `json:"eventType"`
	Taints    []string `json:"taints"`
	Roles     []string `json:"roles"`
	Version   string   `json:"version"`
}

// Process a Kubernetes Node event and send data to the WebSocket client
func ListNodeInfo(data *corev1.Node, eventType string) ([]byte, error) {
	// Calculate the age of the Node
	age := time.Since(data.CreationTimestamp.Time).String()

	// Extract taints
	taints := []string{}
	for _, taint := range data.Spec.Taints {
		taints = append(taints, fmt.Sprintf("%s=%s:%s", taint.Key, taint.Value, taint.Effect))
	}

	// Extract roles from labels
	roles := []string{}
	for key, value := range data.Labels {
		if strings.HasPrefix(key, "node-role.kubernetes.io/") && value == "true" {
			roles = append(roles, strings.TrimPrefix(key, "node-role.kubernetes.io/"))
		}
	}

	// Extract Kubernetes version from node status
	version := data.Status.NodeInfo.KubeletVersion

	// Create a NodeInfo struct with the relevant data
	dataInfo := NodeInfo{
		Name:      data.Name,
		Age:       age,
		EventType: eventType,
		Taints:    taints,
		Roles:     roles,
		Version:   version,
	}

	// Marshal the NodeInfo struct into JSON
	dataJSON, err := json.Marshal(dataInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling Node Info to JSON:", err)
		return nil, err
	}

	return dataJSON, nil
}
