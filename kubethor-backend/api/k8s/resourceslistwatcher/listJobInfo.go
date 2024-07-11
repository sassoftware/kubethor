package resourceslistwatcher

import (
	"encoding/json"
	"fmt"
	"time"

	batchv1 "k8s.io/api/batch/v1"
)

// Custom struct to hold Job information
type JobInfo struct {
	Name            string `json:"name"`
	Namespace       string `json:"namespace"`
	Age             string `json:"age"`
	ConditionStatus string `json:"conditionStatus"`
	Completions     string `json:"completions"`
	EventType       string `json:"eventType"`
}

// ListJobInfo processes a Kubernetes Job event and converts it to JSON format
func ListJobInfo(jobData *batchv1.Job, eventType string) ([]byte, error) {
	// Calculate the age of the Job
	age := time.Since(jobData.CreationTimestamp.Time).String()

	// Extract job condition status
	// The conditions are typically added over time as the job progresses through different states. The last condition usually represents the most recent state of the job. For example, it could indicate whether the job has succeeded, failed, or is still running.
	conditionStatus := "Unknown"
	if len(jobData.Status.Conditions) > 0 {
		condition := jobData.Status.Conditions[len(jobData.Status.Conditions)-1]
		conditionStatus = string(condition.Type)
	}

	// Extract completion status
	completions := fmt.Sprintf("%d/%d", jobData.Status.Succeeded, *jobData.Spec.Completions)

	// Create a JobInfo struct with the relevant data
	jobInfo := JobInfo{
		Name:            jobData.Name,
		Namespace:       jobData.Namespace,
		Age:             age,
		ConditionStatus: conditionStatus,
		Completions:     completions,
		EventType:       eventType,
	}

	// Marshal the JobInfo struct into JSON
	jobJSON, err := json.Marshal(jobInfo)
	if err != nil {
		// Handle the error (e.g., log or close the connection)
		fmt.Println("Error marshaling jobInfo to JSON:", err)
		return nil, err
	}

	return jobJSON, nil
}
