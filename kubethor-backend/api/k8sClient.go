package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"io/ioutil"
	"runtime"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

type UserData struct {
	Clientset        *kubernetes.Clientset
	Namespace        string
	NamespaceList    []string
	ExpirationTime   time.Time
}

var (
	SessionMap = make(map[string]*UserData) // Map to store user data, keyed by session ID
	mapMutex   sync.Mutex                   // Mutex to ensure thread-safe access to SessionMap
)

func InitializeSession(sessionID string, clientset *kubernetes.Clientset, namespace string, namespaceList []string) {
	// Initialize user data and store it in the map
	user := &UserData{
		Clientset:        clientset,
		Namespace:        namespace,
		NamespaceList:    namespaceList,
		ExpirationTime:   time.Now().Add(1 * time.Hour),
	}
	mapMutex.Lock()
	SessionMap[sessionID] = user
	mapMutex.Unlock()
}

func DeleteSession(sessionID string) error {
	mapMutex.Lock()
	defer mapMutex.Unlock()
	if _, ok := SessionMap[sessionID]; !ok {
		return fmt.Errorf("session not found")
	}
	delete(SessionMap, sessionID)
	return nil
}

func RefreshSession(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	mapMutex.Lock()
	defer mapMutex.Unlock()

	user, ok := SessionMap[sessionID]
	if !ok {
		http.Error(w, "session not found", http.StatusNotFound)
		return
	}

	// Extend session expiration time by 1 hour
	user.ExpirationTime = time.Now().Add(1 * time.Hour)

	// Respond with a success message
	response := map[string]interface{}{
		"message": "Session refreshed successfully",
		"success": true,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func CleanupSessions() {
	ticker := time.NewTicker(1 * time.Hour)
	for {
		select {
		case <-ticker.C:
			now := time.Now()
			mapMutex.Lock()
			for sessionID, user := range SessionMap {
				if user.ExpirationTime.Before(now) {
					delete(SessionMap, sessionID)
				}
			}
			mapMutex.Unlock()
		}
	}
}

func GetSession(sessionID string) (*UserData, error) {
	// Retrieve user data from the map
	mapMutex.Lock()
	user, ok := SessionMap[sessionID]
	mapMutex.Unlock()
	if !ok {
		return nil, fmt.Errorf("session not found")
	}
	return user, nil
}

// PrintSessions prints all sessions stored in SessionMap and their count
func _PrintSessions() {
	mapMutex.Lock()
	defer mapMutex.Unlock()
	fmt.Printf("Total sessions: %d\n", len(SessionMap))
	for sessionID, userData := range SessionMap {
		fmt.Printf("Session ID: %s\n", sessionID)
		fmt.Printf("Namespace: %s\n", userData.Namespace)
		fmt.Printf("Namespace List: %v\n", userData.NamespaceList)
		fmt.Printf("Expiration Time: %v\n", userData.ExpirationTime)
		fmt.Println("-----------")
	}
}

func CheckClientSet(sessionID string) error {
	user, err := GetSession(sessionID)
	if err != nil {
		return err
	}
	if user.Clientset == nil {
		return fmt.Errorf("clientset is nil, clientset not properly initialized")
	}
	return nil
}

type RequestData struct {
	Kubeconfig string `json:"kubeconfig"`
}

type ResponseMessage struct {
	Message                 string   `json:"message"`
	Connected               bool     `json:"connected"`
	Status                  int      `json:"status"`
	NamespaceList           []string `json:"namespaceList"`
	CurrentContextNamespace string   `json:"currentContextNamespace"`
}

func JSONResponse(w http.ResponseWriter, message string, connected bool, status int, namespaceList []string, currentContextNamespace string) {
	response := ResponseMessage{
		Message:                 message,
		Connected:               connected,
		Status:                  status,
		NamespaceList:           namespaceList,
		CurrentContextNamespace: currentContextNamespace,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding JSON response: %v", err)
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
}

func BuildKubeConfig(kubeconfig string) (*rest.Config, error) {
	if kubeconfig == "" {
		kubeconfig = filepath.Join(homedir.HomeDir(), ".kube", "config")
	}

	config, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		return nil, err
	}

	// Set the default QPS and Burst to avoid rate limiting
	config.QPS = 50
	config.Burst = 100

	return config, nil
}

// GetNamespaceList retrieves a list of namespaces from the Kubernetes cluster.
func GetNamespaceList(clientset *kubernetes.Clientset) ([]string, error) {
	namespaces, err := clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	var namespaceList []string
	for _, ns := range namespaces.Items {
		namespaceList = append(namespaceList, ns.Name)
	}

	return namespaceList, nil
}

func GetNamespaceFromKubeConfig(kubeconfigPath string) (string, error) {
	if kubeconfigPath == "" {
		kubeconfigPath = filepath.Join(homedir.HomeDir(), ".kube", "config")
	}

	// Load the kubeconfig file
	config, err := clientcmd.LoadFromFile(kubeconfigPath)
	if err != nil {
		return "", err
	}

	// Check if the current-context exists
	currentContextName := config.CurrentContext
	if currentContextName != "" {
		context := config.Contexts[currentContextName]
		if context != nil {
			namespace := context.Namespace
			if namespace != "" {
				return namespace, nil
			}
		}
	}

	// If current-context doesn't exist or doesn't have a namespace, try the first context
	for contextName := range config.Contexts {
		context := config.Contexts[contextName]
		if context != nil {
			namespace := context.Namespace
			if namespace != "" {
				return namespace, nil
			}
		}
	}

	return "", nil
}

func Setk8sClient(w http.ResponseWriter, r *http.Request) {
	// Retrieve the session ID from the request headers
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	// Read the request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Close the request body to avoid resource leaks
	defer r.Body.Close()

	// Define a struct to match the JSON data structure
	var requestData RequestData

	// Unmarshal the JSON data into the struct
	if err := json.Unmarshal(body, &requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Access the kubeconfig key data
	kubeconfigData := requestData.Kubeconfig

	// Print or process the kubeconfig data
	// fmt.Println("Received kubeconfig data:", kubeconfigData)

	// Write the kubeconfig data to a temporary file
	tempKubeconfigFile, err := ioutil.TempFile("", "temp-kubeconfig-*.yaml")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(tempKubeconfigFile.Name()) // Clean up the temporary file
	if _, err := tempKubeconfigFile.WriteString(kubeconfigData); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	tempKubeconfigFile.Close()

	numGoroutines := runtime.NumGoroutine()
	log.Printf("Number of Goroutines running: %d\n", numGoroutines)

	// Build the Kubernetes configuration from the temporary kubeconfig file
	config, err := clientcmd.BuildConfigFromFlags("", tempKubeconfigFile.Name())
	if err != nil {
		JSONResponse(w, fmt.Sprintf("Error creating out-of-cluster config: %v", err), false, http.StatusInternalServerError, nil, "")
		return
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		JSONResponse(w, fmt.Sprintf("Error creating clientset: %v", err), false, http.StatusInternalServerError, nil, "")
		return
	}

	// Retrieve the list of namespaces from the Kubernetes cluster
	namespaceList, err := GetNamespaceList(clientset)
	if err != nil {
		JSONResponse(w, fmt.Sprintf("Error fetching namespace list: %v", err), false, http.StatusInternalServerError, nil, "")
		return
	}

	// Retrieve the current context namespace from the Kubernetes config
	currentContextNamespace, err := GetNamespaceFromKubeConfig(tempKubeconfigFile.Name())
	if err != nil {
		JSONResponse(w, fmt.Sprintf("Error fetching namespace list: %v", err), false, http.StatusInternalServerError, nil, "")
		return
	}
	// if no currentContextNamespace
	if len(namespaceList) > 0 && currentContextNamespace == "" {
		currentContextNamespace = namespaceList[0]
	}

	InitializeSession(sessionID, clientset, currentContextNamespace, namespaceList)

	// Print all sessions and their count
	// _PrintSessions()

	log.Println("Client Connected!")

	JSONResponse(w, "KUBECONFIG Clientset is Connected!!!", true, http.StatusOK, namespaceList, currentContextNamespace)
}

func ClusterConnected(w http.ResponseWriter, r *http.Request) {
	// Extract session ID from the request
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	// Check if the clientset is properly initialized for the session
	if err := CheckClientSet(sessionID); err != nil {
		// Handle error
		return
	}

	// Retrieve session data
	user, err := GetSession(sessionID)
	if err != nil {
		// Handle error
		return
	}

	// Send response with session data
	response := struct {
		IsConnected             bool     `json:"isConnected"`
		CurrentContextNamespace string   `json:"currentContextNamespace"`
		NamespaceList           []string `json:"namespaceList"`
	}{
		IsConnected:             true, // Change this based on your actual logic
		CurrentContextNamespace: user.Namespace,
		NamespaceList:           user.NamespaceList,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send the response as JSON
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func SetClientSetToNil(w http.ResponseWriter, r *http.Request) {
	// Extract session ID from the request
	sessionID := r.Header.Get("X-Session-Id")
	if sessionID == "" {
		http.Error(w, "sessionID not provided", http.StatusBadRequest)
		return
	}

	// Set session's clientset to nil
	delete(SessionMap, sessionID)

	// Respond with success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Clientset has been set to nil for session " + sessionID))
}

func init() {
	SessionMap = make(map[string]*UserData)
	go CleanupSessions()
}
