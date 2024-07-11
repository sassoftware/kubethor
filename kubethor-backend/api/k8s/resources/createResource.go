package resources

import (
	"context"
	"encoding/json"
	"fmt"
	k8sclient "kubethor-backend/api"
	"net/http"

	"github.com/gorilla/mux"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateResource creates a new resource.
func K8sCreateResource(sessionID, namespace, resourceType string, resourceData interface{}) (interface{}, error) {
	// Retrieve user data using session ID
	userData, err := k8sclient.GetSession(sessionID)
	if err != nil {
		return nil, err
	}

	// Check if clientset is properly initialized
	if userData.Clientset == nil {
		return nil, fmt.Errorf("clientset is nil, clientset not properly initialized")
	}

	switch resourceType {
	case "Pod":
		return userData.Clientset.CoreV1().Pods(namespace).Create(context.TODO(), resourceData.(*corev1.Pod), metav1.CreateOptions{})
	case "Deployment":
		return userData.Clientset.AppsV1().Deployments(namespace).Create(context.TODO(), resourceData.(*appsv1.Deployment), metav1.CreateOptions{})
	case "ConfigMap":
		return userData.Clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(), resourceData.(*corev1.ConfigMap), metav1.CreateOptions{})
	// Add cases for other resource types as needed
	default:
		return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
	}
}

func CreateResource(w http.ResponseWriter, r *http.Request) {
	// Retrieve session ID from request header
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	resourceType := vars["resource_type"]

	if namespaceName == "" || resourceType == "" {
		http.Error(w, "resourceType and namespace must be provided", http.StatusBadRequest)
		return
	}

	// Unmarshal the JSON request body into the resourceData object
	resourceData, err := UnmarshalJSONResourceRequestBody(r, resourceType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Create the Kubernetes resource
	createdResource, err := K8sCreateResource(sessionID, namespaceName, resourceType, resourceData)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create resource: %s", err.Error()), http.StatusInternalServerError)
		return
	}

	// Encode and send the created resource as a JSON response
	w.Header().Set("Content-Type", "application/json")
	jsonEncoder := json.NewEncoder(w)
	if err := jsonEncoder.Encode(createdResource); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %s", err.Error()), http.StatusInternalServerError)
		return
	}
}
