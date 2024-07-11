import React from "react";
import { useGlobal } from "../../GlobalState";
import { API_BASE_URL, KubethorUserSessionId } from "../../config";

const StopClusterConnection = () => {
  const { setClusterConnected } = useGlobal();
  const StopClusterConnectionGlobal = () => {
    setClusterConnected(false);
  };

  const handleStopClusterConnect = () => {
    // Make a GET request to your Go API endpoint
    fetch(API_BASE_URL + "/api/k8s/disconnect", {
      method: "GET",
      headers: {
        "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
      },
    })
      .then((response) => {
        // Check if the response status is OK (200)
        if (response.ok) {
          // Set the selected kubeconfig content to be displayed
          StopClusterConnectionGlobal();
          return response.text(); // Assuming the response is plain text
        } else {
          throw new Error("Failed to set ExportedClientSet to nil");
        }
      })
      .then((responseText) => {
        // Handle the success response
        console.log(responseText); // Log the success message
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch request
        console.error(error);
      });
  };

  return (
    <button
      onClick={handleStopClusterConnect}
      className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-stop-circle"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z" />
      </svg>
    </button>
  );
};

export default StopClusterConnection;
