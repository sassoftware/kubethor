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

// DeleteResource fetches a resource by name and type.
// DeleteResponse represents the JSON response structure.
type K8sDeleteResponse struct {
	ResourceType string `json:"resourceType"`
	Namespace    string `json:"namespace"`
	Name         string `json:"name"`
	Status       bool   `json:"status"`
	Message      string `json:"message,omitempty"`
}

func K8sDeleteResource(sessionID, namespace, name, resourceType string) (*K8sDeleteResponse, error) {
	// Retrieve user data using session ID
	userData, err := k8sclient.GetSession(sessionID)
	if err != nil {
		return nil, err
	}

	// Check if clientset is properly initialized
	if userData.Clientset == nil {
		return nil, fmt.Errorf("clientset is nil, clientset not properly initialized")
	}

	resp := &K8sDeleteResponse{
		Namespace:    namespace,
		Name:         name,
		ResourceType: resourceType,
	}

	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}

	switch resourceType {
	case "Pod":
		if err := userData.Clientset.CoreV1().Pods(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Deployment":
		if err := userData.Clientset.AppsV1().Deployments(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "ConfigMap":
		if err := userData.Clientset.CoreV1().ConfigMaps(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Job":
		if err := userData.Clientset.BatchV1().Jobs(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Service":
		if err := userData.Clientset.CoreV1().Services(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Secret":
		if err := userData.Clientset.CoreV1().Secrets(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Endpoints":
		if err := userData.Clientset.CoreV1().Endpoints(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "ServiceAccount":
		if err := userData.Clientset.CoreV1().ServiceAccounts(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "HorizontalPodAutoscaler":
		if err := userData.Clientset.AutoscalingV1().HorizontalPodAutoscalers(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Ingress":
		if err := userData.Clientset.NetworkingV1().Ingresses(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "PersistentVolumeClaim":
		if err := userData.Clientset.CoreV1().PersistentVolumeClaims(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Namespace":
		if err := userData.Clientset.CoreV1().Namespaces().Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Node":
		if err := userData.Clientset.CoreV1().Nodes().Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	case "Event":
		if err := userData.Clientset.CoreV1().Events(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
			resp.Status = false
			resp.Message = err.Error()
			return resp, err
		}
	default:
		resp.Status = false
		resp.Message = fmt.Sprintf("unsupported resource type: %s", resourceType)
		return resp, fmt.Errorf("unsupported resource type: %s", resourceType)
	}

	resp.Status = true
	resp.Message = fmt.Sprintf("sucessfully deleted %s: %s from %s", resourceType, name, namespace)
	return resp, nil
}

func DeleteResource(w http.ResponseWriter, r *http.Request) {
	// Retrieve session ID from request header
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

	resourceInfo, err := K8sDeleteResource(sessionID, namespaceName, resourceName, resourceType)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting %s info: %s", resourceType, err.Error()), http.StatusInternalServerError)
		return
	}

	// Encode the extendedConfigMap as JSON and send it as the response
	w.Header().Set("Content-Type", "application/json")
	jsonEncoder := json.NewEncoder(w)
	if err := jsonEncoder.Encode(resourceInfo); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %s", err.Error()), http.StatusInternalServerError)
		return
	}
}
