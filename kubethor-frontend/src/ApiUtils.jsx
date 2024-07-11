import axios from "axios";
import { API_BASE_URL, KubethorUserSessionId } from "./config";

export const apiSendKubeconfigToServer = async (kubeconfig) => {
  try {
    const response = await axios.post(
      API_BASE_URL + "/api/k8s/set-client",
      { kubeconfig },
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    // You can return the response data or handle it as needed
    return response.data;
  } catch (error) {
    // Handle errors, e.g., show an error message
    console.error("Error sending kubeconfig:", error);
    throw error; // Rethrow the error for the calling component to handle
  }
};

export const apiDeleteResource = async (
  resource_type,
  namespace_name,
  resource_name
) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/k8s/resource-delete/${resource_type}/${namespace_name}/${resource_name}`,
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error deleting resource:", error);
    return { status: false, error };
  }
};

export const apiGetResource = async (
  resource_type,
  namespace_name,
  resource_name
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/k8s/resource-get/${resource_type}/${namespace_name}/${resource_name}`,
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error geting resource details:", error);
    return { status: false, error };
  }
};

export const apiConfigMapDataKeyUpdateResource = async (
  namespace_name,
  configmap_name,
  datakey_name,
  datakey_value
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/k8s/resource-update-configmap-datakey/${namespace_name}/${configmap_name}/${datakey_name}`,
      datakey_value,
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    // You can return the response data or handle it as needed
    return response;
  } catch (error) {
    // Handle errors, e.g., show an error message
    console.error("Error updating configmap data key:", error);
    throw error; // Rethrow the error for the calling component to handle
  }
};

export const apiDeploymentContainerImageUpdateResource = async (
  namespace_name,
  deployment_name,
  container_name,
  image
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/k8s/resource-update-deployment-container-image/${namespace_name}/${deployment_name}/${container_name}`,
      image,
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    // You can return the response data or handle it as needed
    return response;
  } catch (error) {
    // Handle errors, e.g., show an error message
    console.error("Error updating configmap data key:", error);
    throw error; // Rethrow the error for the calling component to handle
  }
};

export const apiUpdateResource = async (
  resource_type,
  namespace_name,
  contentDetails
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/k8s/resource-update/${resource_type}/${namespace_name}`,
      contentDetails,
      {
        headers: {
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
      }
    );

    // You can return the response data or handle it as needed
    return response;
  } catch (error) {
    // Handle errors, e.g., show an error message
    console.error("Error updating resource:", error);
    throw error; // Rethrow the error for the calling component to handle
  }
};
