package main

import (
	"embed"
	"io"
	"io/fs"
	api "kubethor-backend/api"
	k8sApi "kubethor-backend/api/k8s"
	config "kubethor-backend/config"
	"log"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gorilla/mux"
)

//go:embed dist/*
var distFS embed.FS

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/execute", executeCommand)
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	http.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	k8sApiRouter := r.PathPrefix("/api/k8s").Subrouter()
	r.HandleFunc("/api/k8s/set-client", api.Setk8sClient).Methods("POST")
	r.HandleFunc("/api/k8s/refresh-session", api.RefreshSession).Methods("GET")
	r.HandleFunc("/api/k8s/cluster-connected", api.ClusterConnected).Methods("GET")
	r.HandleFunc("/api/k8s/disconnect", api.SetClientSetToNil).Methods("GET")
	k8sApi.RegisterK8sRouters(k8sApiRouter)

	// Serve your ReactJS frontend (assuming it's in a "build" directory)
	// Create a subdirectory in the embedded file system
	subFS, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Println("Failed to locate embedded files:", err)
		return
	}

	fileServer := http.FileServer(http.FS(subFS))
	r.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Log requested URL for debugging
		// log.Println("Requested URL:", r.URL.Path)

		// IMPORTANT: Always check dist folder for files as we are using embed, react routes are not printed here.
		// If the path is not "/", and is not a known asset ("/assets/") or a specific file ("/logo.png"),
		// redirect to "/"
		// This logic ensures that when serving with React routes, unknown file paths are redirected to the home page
		if r.URL.Path != "/" && !strings.HasPrefix(r.URL.Path, "/assets/") && r.URL.Path != "/logo.png" {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}

		// Serve static files
		fileServer.ServeHTTP(w, r)
	}))

	handler := config.CORS.Handler(r)

	port := ":8080"
	log.Println("Server started on " + port)
	http.Handle("/", handler)
	http.ListenAndServe(port, nil)
}

func executeCommand(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	cmd, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading command", http.StatusBadRequest)
		return
	}

	output, err := exec.Command("sh", "-c", string(cmd)).CombinedOutput()
	if err != nil {
		http.Error(w, "Failed to execute command", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Write(output)
}
