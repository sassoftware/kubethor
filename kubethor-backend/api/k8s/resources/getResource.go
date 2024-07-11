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
func K8sFetchResource(sessionID, namespace, name, resourceType string) (interface{}, error) {
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
		return userData.Clientset.CoreV1().Pods(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Deployment":
		return userData.Clientset.AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "ConfigMap":
		return userData.Clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Job":
		return userData.Clientset.BatchV1().Jobs(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Service":
		return userData.Clientset.CoreV1().Services(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Secret":
		return userData.Clientset.CoreV1().Secrets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Endpoints":
		return userData.Clientset.CoreV1().Endpoints(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "ServiceAccount":
		return userData.Clientset.CoreV1().ServiceAccounts(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "HorizontalPodAutoscaler":
		return userData.Clientset.AutoscalingV1().HorizontalPodAutoscalers(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Ingress":
		return userData.Clientset.NetworkingV1().Ingresses(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "PersistentVolumeClaim":
		return userData.Clientset.CoreV1().PersistentVolumeClaims(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	case "Namespace":
		return userData.Clientset.CoreV1().Namespaces().Get(context.TODO(), name, metav1.GetOptions{})
	case "Node":
		return userData.Clientset.CoreV1().Nodes().Get(context.TODO(), name, metav1.GetOptions{})
	case "Event":
		return userData.Clientset.CoreV1().Events(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	default:
		return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
	}
}

func GetResource(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	resourceName := vars["resource_name"]
	resourceType := vars["resource_type"]

	if namespaceName == "" || resourceName == "" || resourceType == "" {
		http.Error(w, "namespace, resource name & type must be provided", http.StatusBadRequest)
		return
	}

	// Fetch the resource data as a JSON byte slice
	resourceData, err := K8sFetchResource(sessionID, namespaceName, resourceName, resourceType)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting %s info: %s", resourceType, err.Error()), http.StatusInternalServerError)
		return
	}

	// Convert the resourceData to a map
	var metadataMap map[string]interface{}
	jsonData, err := json.Marshal(resourceData)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error converting resourceData to map: %s", err.Error()), http.StatusInternalServerError)
		return
	}
	if err := json.Unmarshal(jsonData, &metadataMap); err != nil {
		http.Error(w, fmt.Sprintf("Error converting resourceData to map: %s", err.Error()), http.StatusInternalServerError)
		return
	}

	// Add additional fields to the metadata map
	metadataMap["apiVersion"] = "v1" // Change this to the appropriate API version for your resource
	metadataMap["kind"] = resourceType

	// Encode the modified map as JSON and send it as the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(metadataMap); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %s", err.Error()), http.StatusInternalServerError)
		return
	}

}
