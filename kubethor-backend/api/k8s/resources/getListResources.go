package resources

import (
	"context"
	"encoding/json"
	"fmt"
	k8sclient "kubethor-backend/api"
	"net/http"

	"github.com/gorilla/mux"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// FetchResource fetches a resource by name and type.
func K8sGetListResource(sessionID, namespace, resourceType string) (interface{}, error) {
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
		return userData.Clientset.CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	case "Deployment":
		return userData.Clientset.AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{})
	case "ConfigMap":
		return userData.Clientset.CoreV1().ConfigMaps(namespace).List(context.TODO(), metav1.ListOptions{})
	default:
		return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
	}
}

func GetListResource(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	resourceType := vars["resource_type"]

	if namespaceName == "" || resourceType == "" {
		http.Error(w, "namespace, resource type must be provided", http.StatusBadRequest)
		return
	}

	// Fetch the resource data as a JSON byte slice
	resourceData, err := K8sGetListResource(sessionID, namespaceName, resourceType)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting %s info: %s", resourceType, err.Error()), http.StatusInternalServerError)
		return
	}

	// Encode the modified map as JSON and send it as the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resourceData); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %s", err.Error()), http.StatusInternalServerError)
		return
	}

}
