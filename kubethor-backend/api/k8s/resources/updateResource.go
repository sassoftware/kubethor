package resources

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	k8sclient "kubethor-backend/api"
	"net/http"

	"github.com/gorilla/mux"
	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// UpdateResource updates a resource.
func K8sUpdateResource(sessionID, namespace, resourceType string, resourceData interface{}) (interface{}, error) {
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
		return userData.Clientset.CoreV1().Pods(namespace).Update(context.TODO(), resourceData.(*corev1.Pod), metav1.UpdateOptions{})
	case "Deployment":
		return userData.Clientset.AppsV1().Deployments(namespace).Update(context.TODO(), resourceData.(*appsv1.Deployment), metav1.UpdateOptions{})
	case "ConfigMap":
		return userData.Clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), resourceData.(*corev1.ConfigMap), metav1.UpdateOptions{})
	case "Job":
		return userData.Clientset.BatchV1().Jobs(namespace).Update(context.TODO(), resourceData.(*batchv1.Job), metav1.UpdateOptions{})
	case "Service":
		return userData.Clientset.CoreV1().Services(namespace).Update(context.TODO(), resourceData.(*corev1.Service), metav1.UpdateOptions{})
	case "Secret":
		return userData.Clientset.CoreV1().Secrets(namespace).Update(context.TODO(), resourceData.(*corev1.Secret), metav1.UpdateOptions{})
	case "Endpoints":
		return userData.Clientset.CoreV1().Endpoints(namespace).Update(context.TODO(), resourceData.(*corev1.Endpoints), metav1.UpdateOptions{})
	case "ServiceAccount":
		return userData.Clientset.CoreV1().ServiceAccounts(namespace).Update(context.TODO(), resourceData.(*corev1.ServiceAccount), metav1.UpdateOptions{})
	case "HorizontalPodAutoscaler":
		return userData.Clientset.AutoscalingV1().HorizontalPodAutoscalers(namespace).Update(context.TODO(), resourceData.(*autoscalingv1.HorizontalPodAutoscaler), metav1.UpdateOptions{})
	case "Ingress":
		return userData.Clientset.NetworkingV1().Ingresses(namespace).Update(context.TODO(), resourceData.(*networkingv1.Ingress), metav1.UpdateOptions{})
	case "PersistentVolumeClaim":
		return userData.Clientset.CoreV1().PersistentVolumeClaims(namespace).Update(context.TODO(), resourceData.(*corev1.PersistentVolumeClaim), metav1.UpdateOptions{})
	case "Namespace":
		return userData.Clientset.CoreV1().Namespaces().Update(context.TODO(), resourceData.(*corev1.Namespace), metav1.UpdateOptions{})
	case "Node":
		return userData.Clientset.CoreV1().Nodes().Update(context.TODO(), resourceData.(*corev1.Node), metav1.UpdateOptions{})
	case "Event":
		return userData.Clientset.CoreV1().Events(namespace).Update(context.TODO(), resourceData.(*corev1.Event), metav1.UpdateOptions{})
	// Add cases for other resource types as needed
	default:
		return nil, fmt.Errorf("unsupported resource type: %s", resourceType)
	}
}

// Update Resources
func UpdateResource(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	resourceType := vars["resource_type"]

	if namespaceName == "" || resourceType == "" {
		http.Error(w, "namespace, resource name & type must be provided", http.StatusBadRequest)
		return
	}

	// Unmarshal the JSON request body into the resourceData object
	resourceData, err := UnmarshalJSONResourceRequestBody(r, resourceType)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Create the Kubernetes resource
	updateResource, err := K8sUpdateResource(sessionID, namespaceName, resourceType, resourceData)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create resource: %s", err.Error()), http.StatusInternalServerError)
		return
	}

	// Encode and send the created resource as a JSON response
	w.Header().Set("Content-Type", "application/json")
	jsonEncoder := json.NewEncoder(w)
	if err := jsonEncoder.Encode(updateResource); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %s", err.Error()), http.StatusInternalServerError)
		return
	}
}

// UpdateConfigMapDataKeyDetails updates a specific key within a ConfigMap in the specified namespace.
func UpdateConfigMapDataKeyDetails(sessionID, namespace, configMapName, key, newValue string) (*corev1.ConfigMap, error) {
	// Fetch the existing ConfigMap
	existingConfigMap, err := K8sFetchResource(sessionID, namespace, configMapName, "ConfigMap")
	if err != nil {
		return nil, err
	}

	// Perform a type assertion to convert configMapInfo to *corev1.ConfigMap.
	configMap, ok := existingConfigMap.(*corev1.ConfigMap)
	if !ok {
		return nil, fmt.Errorf("unexpected type for configMapInfo")
	}

	// Modify the specific key in the ConfigMap data
	configMap.Data[key] = newValue

	// Update the ConfigMap in the cluster
	updatedConfigMap, err := K8sUpdateResource(sessionID, namespace, "ConfigMap", configMap)
	if err != nil {
		return nil, err
	}

	// Perform a type assertion to convert configMapInfo to *corev1.ConfigMap.
	updatedConfigMapWithDataKey, ok := updatedConfigMap.(*corev1.ConfigMap)
	if !ok {
		return nil, fmt.Errorf("unexpected type for configMapInfo")
	}

	return updatedConfigMapWithDataKey, nil
}

// Update ConfigMap Data Key Only
func UpdateConfigMapDataKey(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	configMapName := vars["config_map_name"]
	configMapDataKey := vars["config_map_data_key"]

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Convert the plain text body to a string
	newValue := string(body)

	// Call the function to update the ConfigMap data key
	updatedConfigMap, err := UpdateConfigMapDataKeyDetails(sessionID, namespaceName, configMapName, configMapDataKey, newValue)
	if err != nil {
		http.Error(w, "Error updating ConfigMap data key: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the updated ConfigMap in JSON format
	w.Header().Set("Content-Type", "application/json")
	// Assuming you have a function to convert the ConfigMap to JSON
	json.NewEncoder(w).Encode(updatedConfigMap)
}

// UpdateDeploymentContainerImageDetails updates a specific image of container within a deployment in the specified namespace.
func UpdateDeploymentContainerImageDetails(sessionID, namespace, deploymentName, containerName, newValue string) (*appsv1.Deployment, error) {
	// Fetch the existing Deployment
	existingDeployment, err := K8sFetchResource(sessionID, namespace, deploymentName, "Deployment")
	if err != nil {
		return nil, err
	}

	// Perform a type assertion to convert Deployment Info to *appsv1.Deployment.
	deployment, ok := existingDeployment.(*appsv1.Deployment)
	if !ok {
		return nil, fmt.Errorf("unexpected type for Deployment Info")
	}

	// Modify the container image in the Deployment data
	for i, container := range deployment.Spec.Template.Spec.Containers {
		if container.Name == containerName {
			deployment.Spec.Template.Spec.Containers[i].Image = newValue
		}
	}

	// Update the ConfigMap in the cluster
	updatedDeployment, err := K8sUpdateResource(sessionID, namespace, "Deployment", deployment)
	if err != nil {
		return nil, err
	}

	// Perform a type assertion to convert Deployment Info to *appsv1.Deployment.
	updatedDeploymentWithContainerImage, ok := updatedDeployment.(*appsv1.Deployment)
	if !ok {
		return nil, fmt.Errorf("unexpected type for configMapInfo")
	}

	return updatedDeploymentWithContainerImage, nil
}

// Update Deployment Container Image
func UpdateDeploymentContainerImage(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	deploymentName := vars["deployment_name"]
	containerName := vars["container_name"]

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Convert the plain text body to a string
	newValue := string(body)

	// Call the function to update the Deployment Container Image
	updatedDeployment, err := UpdateDeploymentContainerImageDetails(sessionID, namespaceName, deploymentName, containerName, newValue)
	if err != nil {
		http.Error(w, "Error updating Container Image: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the updated ConfigMap in JSON format
	w.Header().Set("Content-Type", "application/json")
	// Assuming you have a function to convert the Deployment to JSON
	json.NewEncoder(w).Encode(updatedDeployment)
}
