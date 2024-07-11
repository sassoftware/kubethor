package resources

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	k8sclient "kubethor-backend/api"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	appsv1 "k8s.io/api/apps/v1"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"
	"k8s.io/client-go/kubernetes"
)

func CreateResourceCommand(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	namespaceName := vars["namespace_name"]
	commandType := vars["command_type"]

	if namespaceName == "" || commandType == "" {
		http.Error(w, "command_type and namespace must be provided", http.StatusBadRequest)
		return
	}

	resource, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to read request body: %v", err), http.StatusBadRequest)
		return
	}

	result, err := K8sCreateResourceCommand(sessionID, resource, namespaceName, commandType)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to process resource: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func K8sCreateResourceCommand(sessionID string, resource []byte, namespace, operation string) (interface{}, error) {
	// Retrieve user data using session ID
	userData, err := k8sclient.GetSession(sessionID)
	if err != nil {
		return nil, err
	}

	// Check if clientset is properly initialized
	if userData.Clientset == nil {
		return nil, fmt.Errorf("clientset is nil, clientset not properly initialized")
	}

	scheme := runtime.NewScheme()
	appsv1.AddToScheme(scheme)
	corev1.AddToScheme(scheme)
	networkingv1.AddToScheme(scheme)
	batchv1.AddToScheme(scheme) // Add scheme for batch/v1 for Jobs

	deserializer := serializer.NewCodecFactory(scheme).UniversalDeserializer()

	// Split the YAML file into individual documents
	documents := strings.Split(string(resource), "---")
	var results []interface{}

	for _, doc := range documents {
		if strings.TrimSpace(doc) == "" {
			continue
		}

		// Decode the document into a runtime.Object
		obj, _, err := deserializer.Decode([]byte(doc), nil, nil)
		if err != nil {
			return nil, err
		}

		// Apply, create, or delete the object based on its type
		var result interface{}
		switch resource := obj.(type) {
		case *appsv1.Deployment:
			result, err = handleDeployment(userData.Clientset, resource, operation, namespace)
		case *corev1.Service:
			result, err = handleService(userData.Clientset, resource, operation, namespace)
		case *networkingv1.Ingress:
			result, err = handleIngress(userData.Clientset, resource, operation, namespace)
		case *corev1.Pod:
			result, err = handlePod(userData.Clientset, resource, operation, namespace)
		case *batchv1.Job: // Handle Job resources
			result, err = handleJob(userData.Clientset, resource, operation, namespace)
		case *corev1.ConfigMap: // Handle ConfigMap resources
			result, err = handleConfigMap(userData.Clientset, resource, operation, namespace)
		case *corev1.Secret: // Handle Secret resources
			result, err = handleSecret(userData.Clientset, resource, operation, namespace)
		default:
			err = fmt.Errorf("unknown resource type: %T", resource)
		}

		if err != nil {
			return nil, err
		}

		results = append(results, result)
	}

	return results, nil
}

func handleDeployment(clientset *kubernetes.Clientset, resource *appsv1.Deployment, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.AppsV1().Deployments(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.AppsV1().Deployments(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.AppsV1().Deployments(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.AppsV1().Deployments(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.AppsV1().Deployments(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handleService(clientset *kubernetes.Clientset, resource *corev1.Service, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.CoreV1().Services(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.CoreV1().Services(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.CoreV1().Services(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.CoreV1().Services(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.CoreV1().Services(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handleIngress(clientset *kubernetes.Clientset, resource *networkingv1.Ingress, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.NetworkingV1().Ingresses(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.NetworkingV1().Ingresses(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.NetworkingV1().Ingresses(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.NetworkingV1().Ingresses(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.NetworkingV1().Ingresses(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handlePod(clientset *kubernetes.Clientset, resource *corev1.Pod, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.CoreV1().Pods(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.CoreV1().Pods(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.CoreV1().Pods(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.CoreV1().Pods(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.CoreV1().Pods(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handleJob(clientset *kubernetes.Clientset, resource *batchv1.Job, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.BatchV1().Jobs(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.BatchV1().Jobs(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.BatchV1().Jobs(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.BatchV1().Jobs(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		deletePolicy := metav1.DeletePropagationBackground
		deleteOptions := metav1.DeleteOptions{
			PropagationPolicy: &deletePolicy,
		}
		return nil, clientset.BatchV1().Jobs(namespace).Delete(context.TODO(), resource.Name, deleteOptions)
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handleConfigMap(clientset *kubernetes.Clientset, resource *corev1.ConfigMap, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.CoreV1().ConfigMaps(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}

func handleSecret(clientset *kubernetes.Clientset, resource *corev1.Secret, operation string, namespace string) (interface{}, error) {
	switch operation {
	case "create":
		return clientset.CoreV1().Secrets(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
	case "apply":
		_, err := clientset.CoreV1().Secrets(namespace).Get(context.TODO(), resource.Name, metav1.GetOptions{})
		if errors.IsNotFound(err) {
			return clientset.CoreV1().Secrets(namespace).Create(context.TODO(), resource, metav1.CreateOptions{})
		} else if err != nil {
			return nil, err
		} else {
			return clientset.CoreV1().Secrets(namespace).Update(context.TODO(), resource, metav1.UpdateOptions{})
		}
	case "delete":
		return nil, clientset.CoreV1().Secrets(namespace).Delete(context.TODO(), resource.Name, metav1.DeleteOptions{})
	default:
		return nil, fmt.Errorf("unknown operation: %s", operation)
	}
}
