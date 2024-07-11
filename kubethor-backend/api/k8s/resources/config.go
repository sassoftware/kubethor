package resources

import (
	"fmt"
	"io"
	"net/http"

	"encoding/json"

	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
)

// Unmarshal the JSON request body into the resourceData object for Create and Update Resource
func UnmarshalJSONResourceRequestBody(r *http.Request, resourceType string) (interface{}, error) {
	requestBody, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read request body: %s", err.Error())
	}

	var resourceData interface{}

	switch resourceType {
	case "Pod":
		var pod corev1.Pod
		if err := json.Unmarshal(requestBody, &pod); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &pod
	case "Deployment":
		var deployment appsv1.Deployment
		if err := json.Unmarshal(requestBody, &deployment); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &deployment
	case "ConfigMap":
		var configMap corev1.ConfigMap
		if err := json.Unmarshal(requestBody, &configMap); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &configMap
	case "Job":
		var job batchv1.Job
		if err := json.Unmarshal(requestBody, &job); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &job
	case "Service":
		var service corev1.Service
		if err := json.Unmarshal(requestBody, &service); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &service
	case "Secret":
		var secrets corev1.Secret
		if err := json.Unmarshal(requestBody, &secrets); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &secrets
	case "HorizontalPodAutoscaler":
		var hpa autoscalingv1.HorizontalPodAutoscaler
		if err := json.Unmarshal(requestBody, &hpa); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &hpa
	case "Ingress":
		var ingress networkingv1.Ingress
		if err := json.Unmarshal(requestBody, &ingress); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &ingress
	case "Endpoints":
		var endpoint corev1.Endpoints
		if err := json.Unmarshal(requestBody, &endpoint); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &endpoint
	case "ServiceAccount":
		var serviceaccount corev1.Endpoints
		if err := json.Unmarshal(requestBody, &serviceaccount); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &serviceaccount
	case "PersistentVolumeClaim":
		var persistentVolumeClaim corev1.PersistentVolumeClaim
		if err := json.Unmarshal(requestBody, &persistentVolumeClaim); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &persistentVolumeClaim
	case "Namespace":
		var namespace corev1.Namespace
		if err := json.Unmarshal(requestBody, &namespace); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &namespace
	case "Node":
		var node corev1.Node
		if err := json.Unmarshal(requestBody, &node); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &node
	case "Event":
		var event corev1.Event
		if err := json.Unmarshal(requestBody, &event); err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON request for resource type %s: %s", resourceType, err.Error())
		}
		resourceData = &event
	default:
		return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
	}

	return resourceData, nil
}
