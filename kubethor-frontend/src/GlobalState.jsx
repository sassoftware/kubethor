import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, KubethorUserSessionId } from "./config";

// Create a context for global state
export const GlobalContext = createContext();

// Create a GlobalProvider component to wrap your entire application
export const GlobalProvider = ({ children }) => {
  const [isClusterConnected, setIsClusterConnected] = useState("");
  const [clientNamespaceList, setClientNamespaceListSetter] = useState([]);
  const [clientCurrentNamepace, setClientCurrentNamepaceSetter] = useState("");
  const [clientCurrentNamepaceError, setClientCurrentNamepaceErrorSetter] =
    useState("");
  const [isAlertNotificationDisplayed, setIsAlertNotificationDisplayed] =
    useState("");

  // Define a function to set the global variable
  const setClusterConnected = (value) => {
    setIsClusterConnected(value);
  };
  const setClientNamespaceList = (value) => {
    setClientNamespaceListSetter(value);
  };
  const setClientCurrentNamepace = (value) => {
    setClientCurrentNamepaceSetter(value);
  };
  const setClientCurrentNamepaceError = (value) => {
    setClientCurrentNamepaceErrorSetter(value);
  };

  const showAlertNotificationDisplay = (value) => {
    setIsAlertNotificationDisplayed(value);
  };

  // Fetch the initial value from the API when the component mounts
  useEffect(() => {
    // Check if session ID exists in sessionStorage
    let sessionId = sessionStorage.getItem(KubethorUserSessionId);
    if (!sessionId) {
      // If session ID doesn't exist, generate a new one and store it in sessionStorage
      sessionId = generateSessionId(); // Implement your own session ID generation logic
      sessionStorage.setItem(KubethorUserSessionId, sessionId);
    }

    // Make an API request here to determine the initial value using Axios
    axios
      .get(API_BASE_URL + "/api/k8s/cluster-connected", {
        headers: {
          "X-Session-Id": sessionId,
        },
      })
      .then((response) => {
        // Assuming your API response contains a boolean field named "isConnected"
        const data = response.data;
        setClusterConnected(data.isConnected);
        setClientCurrentNamepace(data.currentContextNamespace);
        setClientNamespaceList(data.namespaceList);
      })
      .catch((error) => {
        console.error("Error fetching initial cluster status:", error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <GlobalContext.Provider
      value={{
        isClusterConnected,
        setClusterConnected,
        clientNamespaceList,
        setClientNamespaceList,
        clientCurrentNamepace,
        setClientCurrentNamepace,
        clientCurrentNamepaceError,
        setClientCurrentNamepaceError,
        isAlertNotificationDisplayed,
        showAlertNotificationDisplay,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to access the global state
export const useGlobal = () => {
  return useContext(GlobalContext);
};

// Function to generate a session ID (you can replace this with your own logic)
const generateSessionId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
