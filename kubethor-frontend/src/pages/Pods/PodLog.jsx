import React, { useEffect, useState } from "react";
import { useGlobal } from "../../GlobalState";
import { API_WS_URL, GetWsStatus, KubethorUserSessionId } from "../../config";

const PodLog = ({ isOpen, onClose, containerName, podName }) => {
  const { clientCurrentNamepace } = useGlobal();
  const sessionId = sessionStorage.getItem(KubethorUserSessionId);
  const WS_URL =
    API_WS_URL +
    `/api/k8s/ws/resource-watcher/pod-logs/${clientCurrentNamepace}/${podName}/${containerName}?sessionId=${sessionId}`;

  const [logs, setLogs] = useState([]);
  const [wsStatus, setWsConnectionStatus] = useState("disconnected");

  const connectWebSocket = () => {
    // console.log("Connecting to WebSocket at URL:", WS_URL);
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      setWsConnectionStatus("connected");
      setLogs([]);
      // console.log("WebSocket connected");
    };

    socket.onclose = (event) => {
      setWsConnectionStatus("disconnected");
      // console.log("WebSocket closed:", event);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const formattedLog = {
        timestamp: data.timestamp,
        log: data.log,
      };
      setLogs((prevLogs) => [...prevLogs, formattedLog]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      // console.log("Closing WebSocket connection");
      setLogs([]);
      socket.close();
    };
  };

  useEffect(() => {
    if (isOpen) {
      const disconnectWebSocket = connectWebSocket();

      return () => {
        disconnectWebSocket();
      };
    }
  }, [WS_URL, isOpen, containerName, podName]);

  return (
    <div
      id="drawer-bottom-example"
      className="fixed bottom-0 left-0 right-0 z-40 w-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
      tabIndex="-1"
      aria-labelledby="drawer-bottom-label"
    >
      <h5
        id="drawer-bottom-label"
        className="inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
      >
        <div className="pb-2">{GetWsStatus(wsStatus)}</div> Pod Name: {podName}{" "}
        | Container Name: {containerName}
        {wsStatus === "disconnected" && (
          <button className="ml-2 text-red-600 flex" onClick={connectWebSocket}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-exclamation-diamond-fill mt-1 mr-2 text-yellow-300"
              viewBox="0 0 16 16"
            >
              <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            Connection Lost! Click to retry
          </button>
        )}
      </h5>
      <button
        type="button"
        data-drawer-hide="drawer-bottom-example"
        aria-controls="drawer-bottom-example"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={onClose}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close menu</span>
      </button>
      <div className="logs-container h-64 overflow-y-auto mt-4 p-2 bg-gray-100 dark:bg-gray-700">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={index}
              className="log-entry text-sm text-gray-700 dark:text-gray-300"
            >
              <pre>
                <b>
                  {log.timestamp} {"    "}
                </b>
                {log.log}
              </pre>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No logs available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PodLog;
