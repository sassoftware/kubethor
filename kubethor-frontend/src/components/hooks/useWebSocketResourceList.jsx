import { useState, useEffect } from "react";
import { KubethorUserSessionId } from "../../config";

const useWebSocketResourceList = (
  WS_URL,
  clientCurrentNamepace,
  showAlertNotificationDisplay,
  setClientCurrentNamepaceError
) => {
  const [wsStatus, setWsStatus] = useState("disconnected");
  const [data, setData] = useState([]);
  const [shouldConnectWebSocket, setShouldConnectWebSocket] = useState(true);
  const sessionId = sessionStorage.getItem(KubethorUserSessionId);

  useEffect(() => {
    let socket;

    const connectWebSocket = () => {
      setWsStatus("connecting");
      socket = new WebSocket(`${WS_URL}?sessionId=${sessionId}`);

      socket.onopen = () => {
        setWsStatus("connected");

        // For testing Purpose, closing after 5 sec to check if retry works
        // setTimeout(() => {
        //   console.log("WS CLOSED - PURPOSELY");
        //   socket.close();
        // }, 20000);
      };

      socket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData.error) {
            setClientCurrentNamepaceError(
              parsedData.error + " (Maybe Forbidden)"
            );
            showAlertNotificationDisplay(
              "Error Receiving Resources: " + parsedData.error
            );
          } else {
            // If no error
            setClientCurrentNamepaceError("");
            if (parsedData.eventType === "DELETED") {
              setData((prevData) =>
                prevData.filter((item) => item.name !== parsedData.name)
              );
            } else {
              setData((prevData) => {
                const existingIndex = prevData.findIndex(
                  (item) => item.name === parsedData.name
                );
                if (existingIndex !== -1) {
                  prevData[existingIndex] = parsedData;
                  return [...prevData];
                } else {
                  return [...prevData, parsedData];
                }
              });
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onclose = (event) => {
        setWsStatus("disconnected");
        console.error("disconnected:", event);
        setData([]);
        // Retry connection after a delay
        setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
      };

      socket.onerror = (error) => {
        setWsStatus("error");
        setData([]);
        console.error("WebSocket error:", error);
      };

      return () => {
        socket.close();
        setWsStatus("disconnected");
      };
    };

    if (shouldConnectWebSocket) {
      connectWebSocket();
    }

    return () => {
      setShouldConnectWebSocket(false);
    };
  }, [WS_URL, shouldConnectWebSocket, sessionId]);

  useEffect(() => {
    setShouldConnectWebSocket(true);
    setData([]);

    return () => {
      setShouldConnectWebSocket(false);
    };
  }, [clientCurrentNamepace]);

  return { wsStatus, data };
};

export default useWebSocketResourceList;
