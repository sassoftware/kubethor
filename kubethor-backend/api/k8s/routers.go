package k8s

import (
	"kubethor-backend/api/k8s/resources"
	"kubethor-backend/api/k8s/resourceslistwatcher"

	"github.com/gorilla/mux"
)

func RegisterK8sRouters(r *mux.Router) {
	// *******Resources API's*********
	r.HandleFunc("/resource-get-list/{resource_type}/{namespace_name}", resources.GetListResource).Methods("GET")
	r.HandleFunc("/resource-delete/{resource_type}/{namespace_name}/{resource_name}", resources.DeleteResource).Methods("DELETE")
	r.HandleFunc("/resource-get/{resource_type}/{namespace_name}/{resource_name}", resources.GetResource).Methods("GET")
	r.HandleFunc("/resource-create/{resource_type}/{namespace_name}", resources.CreateResource).Methods("POST")
	r.HandleFunc("/resource-create-command/{namespace_name}/{command_type}", resources.CreateResourceCommand).Methods("POST")
	r.HandleFunc("/resource-update/{resource_type}/{namespace_name}", resources.UpdateResource).Methods("POST")
	r.HandleFunc("/resource-update-configmap-datakey/{namespace_name}/{config_map_name}/{config_map_data_key}", resources.UpdateConfigMapDataKey).Methods("POST")
	r.HandleFunc("/resource-update-deployment-container-image/{namespace_name}/{deployment_name}/{container_name}", resources.UpdateDeploymentContainerImage).Methods("POST")

	// ******Resources List Watcher (Websockets) ******
	r.HandleFunc("/ws/resource-watcher/list/{resource_type}/{namespace_name}", resourceslistwatcher.ListResources)
	r.HandleFunc("/ws/resource-watcher/pod-logs/{namespace_name}/{pod_name}/{container_name}", resourceslistwatcher.WatchPodLogs)
}
