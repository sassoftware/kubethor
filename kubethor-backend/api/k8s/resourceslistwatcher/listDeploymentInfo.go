package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	appsv1 "k8s.io/api/apps/v1"
)

// Custom struct to hold Deployment information
type DeploymentInfo struct {
	Name        string `json:"name"`
	Namespace   string `json:"namespace"`
	RunningPods int32  `json:"runningPods"` // Number of running pods
	TotalPods   int32  `json:"totalPods"`   // Total number of pods
	Replicas    int32  `json:"replicas"`
	Age         string `json:"age"`
	Conditions  struct {
		Available   string `json:"available"`
		Progressing string `json:"progressing"`
	} `json:"conditions"`
	EventType string `json:"eventType"`
}

// Process a Kubernetes Deployment event and send data to the WebSocket client
func ListDeploymentInfo(deploymentData *appsv1.Deployment, eventType string) ([]byte, error) {
	// Calculate the age of the Deployment
	age := time.Since(deploymentData.CreationTimestamp.Time).String()

	// Initialize condition fields as empty strings
	availableCondition := ""
	progressingCondition := ""

	// Check if conditions are available
	if deploymentData.Status.Conditions != nil {
		for _, condition := range deploymentData.Status.Conditions {
			switch condition.Type {
			case "Available":
				availableCondition = string(condition.Status)
			case "Progressing":
				progressingCondition = string(condition.Status)
			}
		}
	}

	// Calculate the number of running pods and the total number of pods
	runningPods := deploymentData.Status.AvailableReplicas
	totalPods := deploymentData.Status.Replicas

	// Create a DeploymentInfo struct with the relevant data
	deploymentInfo := DeploymentInfo{
		Name:        deploymentData.Name,
		Namespace:   deploymentData.Namespace,
		RunningPods: runningPods,
		TotalPods:   totalPods,
		Replicas:    deploymentData.Status.Replicas,
		Age:         age,
		EventType:   eventType,
	}

	// Set conditions in the DeploymentInfo struct
	deploymentInfo.Conditions.Available = availableCondition
	deploymentInfo.Conditions.Progressing = progressingCondition

	// Marshal the DeploymentInfo struct into JSON
	deploymentJSON, err := json.Marshal(deploymentInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling deploymentInfo to JSON:", err)
		return nil, err
	}

	return deploymentJSON, nil
}
