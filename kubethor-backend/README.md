# Kubethor API Documentation

## Table of Contents

- [Introduction](#introduction)
- [Note](#note)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API and Websockets Endpoints](#api-and-websockets-endpoints)
  - [Client Endpoints](#client-endpoints)
    - [Set Client using KUBECONFIG File](#set-client-using-kubeconfig-file)
    - [Check Cluster Client Connected](#check-cluster-client-connected)
    - [Disconnect Cluster Clientset](#disconnect-cluster-clientset)
  - [Reources API Endpoints](#resources-api-endpoints)
    - [Get Resource Details by Namespace, Resource Type, and Resource Name](#get-resource-details-by-namespace-resource-type-and-resource-name)
    - [Delete Resource Details by Namespace, Resource Type, and Resource Name](#delete-resource-details-by-namespace-resource-type-and-resource-name)
    - [Create Resource Details by Namespace and Resource Type](#create-resource-details-by-namespace-and-resource-type)
    - [Update Resource Details by Namespace and Resource Type](#update-resource-details-by-namespace-and-resource-type)
    - [Update Resource Config Map Data Key Details by Namespace, Config Map Name and Config Map Data Key](#update-resource-config-map-data-key-details-by-namespace-config-map-name-and-config-map-data-key)
    - [Update Resource Deployment Container Image Details by Namespace, Deployment Name and Container Name](#update-resource-deployment-container-image-details-by-namespace-deployment-name-and-container-name)
  - [Resources Websocket Endpoints](#resources-websocket-endpoints)
    - [Get Resource List based on Resource Type and Namespace](#get-resource-list-based-on-resource-type-and-namespace)
    - [Get Resource Pod Container Logs based on Namespace, Pod Name and Pod Container Name](#get-resource-pod-container-logs-based-on-namespace-pod-name-and-pod-container-name)
- [Support](#support)
- [License](#license)

# Introduction

Welcome to the documentation for Kubethor API. This API provides various features for developers to use in their applications.

# Note

By using Resources, Namespace, Name, Type, we converted these urls from (4 \* n) to 4, where 4 is CRUD. and n listing to 1 where is n listing.

# Installation

To use this API, you don't need to install anything. It's accessible over the internet.

# Getting Started

Before using the API, you should get familiar with the basics. Let's start with the authentication process.

# API Endpoints

## Client Endpoints

### Set Client using KUBECONFIG File

- **URL:** `http://localhost:8080/api/k8s/set-client`
- **Method:** `POST`
- **Description:** This will set the KUBECONFIG File for accessing cluster.
- **Body Example**
  ```json
  {
    "kubeconfig": "Kube Config File"
  }
  ```
- **Success Response:**

  ```json
  {
    "message": "KUBECONFIG Clientset is Connected!!!",
    "connected": true,
    "status": 200,
    "namespaceList": ["namespace1", "namespace2"] | null,
    "currentContextNamespace": "namespace1" | ""
  }
  ```

### Check Cluster Client Connected

- **URL:** `http://localhost:8080/api/k8s/cluster-connected`
- **Method:** `GET`
- **Description:** This will check the global variable if nil or not
- **Success Response:**

  ```json
  {
    "isConnected": false,
    "currentContextNamespace": "",
    "namespaceList": []
  }
  ```

### Disconnect Cluster Clientset

- **URL:** `http://localhost:8080/api/k8s/disconnect`
- **Method:** `GET`
- **Description:** This will set Global Client Set Variable to Nil
- **Success Response:**

  ```
  ExportedClientSet has been set to nil
  ```

---

## Resources API Endpoints

### Delete Resource Details by Namespace, Resource Type, and Resource Name

- **URL:** `http://localhost:8080/api/k8s/resource-delete/{resource_type}/{namespace_name}/{resource_name}`
- **Method:** `DELETE`
- **Description:** Delete full information about a config map by its namespace and config_map_name.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{resource_type}` (string, required): pod | deployment | configmap
  - `{resource_name}` (string, required): The unique resource name in {namespace_name} of the client.
- **Body**

  ```json
  {
    "resourceType": "{resource_type}",
    "namespace": "{namespace_name}",
    "name": "{resource_name}",
    "status": true | false,
    "namespace": "message",
  }
  ```

### Get Resource Details by Namespace, Resource Type, and Resource Name

- **URL:** `http://localhost:8080/api/k8s/resource-get/{resource_type}/{namespace_name}/{resource_name}`
- **Method:** `GET`
- **Description:** Retrieve information about a deployment by its namespace and config_map_name.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{resource_type}` (string, required): pod | deployment | configmap
  - `{resource_name}` (string, required): The unique resource name in {namespace_name} of the client.
- **Response:**
  - Check By Response

### Create Resource Details by Namespace and Resource Type

- **URL:** `http://localhost:8080/api/k8s/resource-create/{resource_type}/{namespace_name}`
- **Method:** `POST`
- **Description:** create full information about a config map by its namespace and resource_type.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{resource_type}` (string, required): pod | deployment | configmap
- **Body Example**
  ```json
  {
    "metadata": {
      "name": "my-configmap",
      "namespace": "my-namespace"
    },
    "data": {
      "key1": "value1",
      "key2": "value2"
    }
  }
  ```
- **Response:**
  - Created Resource

### Update Resource Details by Namespace and Resource Type

- **URL:** `http://localhost:8080/api/k8s/resource-update/{resource_type}/{namespace_name}`
- **Method:** `POST`
- **Description:** update full information about a config map by its namespace and resource_type.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{resource_type}` (string, required): pod | deployment | configmap
- **Body Example**
  ```json
  {
    "metadata": {
      "name": "my-configmap",
      "namespace": "my-namespace"
    },
    "data": {
      "key1": "value1",
      "key2": "value2"
    }
  }
  ```
- **Response:**
  - Updated Resource

### Update Resource Config Map Data Key Details by Namespace, Config Map Name and Config Map Data Key

- **URL:** `http://localhost:8080/api/k8s/resource-update-configmap-datakey/{namespace_name}/{config_map_name}/{config_map_data_key}`
- **Method:** `POST`
- **Description:** Update data key information about a config map by its namespace and config_map_name.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{config_map_name}` (string, required): The unique config map in {namespace_name} of the client.
  - `{config_map_data_key}` (string, required): The unique data key in config map of the client.
- **Body**

  ```text
  ANY TEXT VALUE
  ```

- **Response:**
  - Updated ConfigMap with Updated Data Key Value

### Update Resource Deployment Container Image Details by Namespace, Deployment Name and Container Name

- **URL:** `http://localhost:8080/api/k8s/resource-update-deployment-container-image/{namespace_name}/{deployment_name}/{container_name}`
- **Method:** `POST`
- **Description:** Update container image information about a deployment by its namespace, deployment_name and container_name.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{deployment_name}` (string, required): The unique deployment in {namespace_name} of the client.
  - `{container_name}` (string, required): The unique container_name in {deployment_name} of the client.
- **Body**

  ```text
  ANY TEXT VALUE
  ```

---

## Resources Websocket Endpoints

### Get Resource List based on Resource Type and Namespace

- **URL:** ` ws://localhost:8080/api/k8s/ws/resource-watcher/list/{resource_type}/{namespace_name}`
- **Description:** Retrieve information about resources by its namespace.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{resource_type}` (string, required): pod | deployment | configmap
- **Error Response:**

  ```json
  {
    "error": "Pods: Error watching Pods for Namspace: {namespace_name}"
  }
  ```

- **Pod Response on Websocket:**

  ```json
  {
    "name": "Pod Name",
    "namespace": "{namespace_name}",
    "containers": {
      "container1": "\u0026ContainerState{Waiting:nil,Running:\u0026ContainerStateRunning{StartedAt:2023-09-24 05:31:15 +0530 IST,},Terminated:nil,}",
      "container2": "\u0026ContainerState{Waiting:nil,Running:\u0026ContainerStateRunning{StartedAt:2023-09-24 05:31:14 +0530 IST,},Terminated:nil,}"
    },
    "restarts": 0,
    "controlledBy": "adasdas",
    "node": "asd",
    "qos": "Burstable",
    "age": "5h33m51.8499699s",
    "status": "Succeeded",
    "labels": "labels...",
    "eventType": "ADDED" | "MODIFIED" | "DELETED" | "BOOKMARK" | "ERROR"
  }
  ```

- **Deployment Response on Websocket:**

  ```json
  {
    "name": "Deployment Name",
    "namespace": "{namespace_name}",
    "runningPods": 1,
    "totalPods": 1,
    "replicas": 1,
    "age": "1856h14m41.0251926s",
    "conditions": {
        "available": "True",
        "progressing": "True"
    },
    "eventType": "ADDED" | "MODIFIED" | "DELETED" | "BOOKMARK" | "ERROR"
  }
  ```

- **ConfigMap Response on Websocket:**
  ```json
  {
    "name": "ConfigMap Name",
    "namespace": "{namespace_name}",
    "age": "1856h14m41.0251926s",
    "keys": ["key1", "key2"]
    "eventType": "ADDED" | "MODIFIED" | "DELETED" | "BOOKMARK" | "ERROR"
  }
  ```

### Get Resource Pod Container Logs based on Namespace, Pod Name and Pod Container Name

- **URL:** `ws://localhost:8080/api/k8s/ws/resource-watcher/pod-logs/{namespace_name}/{pod_name}/{container_name}`
- **Description:** Retrieve information about resources by its namespace.
- **URL Parameters:**
  - `{namespace_name}` (string, required): The unique namespace of the client.
  - `{pod_name}` (string, required): The unique pod name in that {namespace_name}
  - `{container_name}` (string, required): The unique container name in that {pod_name}
- **Error Response:**

  ```json
  {
    "error": "Pods: Error watching Pods for Namspace: {namespace_name}"
  }
  ```

- **Log Response:**

  ```json
  {
    "timestamp": "2023-10-03T18:16:57+05:30",
    "log": "whatever"
  }
  ```

---
