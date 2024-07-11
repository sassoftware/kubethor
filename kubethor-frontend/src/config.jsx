export const API_BASE_URL = "http://localhost:8080";
export const API_WS_URL = "ws://localhost:8080";

export const KubethorClientClusterConfigsLocalStorageKey =
  "kubethorClusterKubeConfigs";

export const KubethorUserSessionId = "kubethorUserSessionId";

export function formatDuration(timeString) {
  // Extract hours, minutes, and seconds using regular expressions
  const hoursMatch = timeString.match(/(\d+)h/);
  const minutesMatch = timeString.match(/(\d+)m/);
  const secondsMatch = timeString.match(/(\d+(\.\d+)?)s/);

  // Convert extracted strings to numbers, defaulting to 0 if not found
  const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? parseFloat(secondsMatch[1]) : 0;

  // Calculate the total seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Convert seconds to days
  const totalDays = totalSeconds / (24 * 3600);

  if (totalDays >= 1) {
    // If totalDays is 1 or more, format as integer days
    const days = Math.floor(totalDays);
    return `${days}d`;
  } else {
    // Calculate remaining hours and minutes
    const remainingHours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    return `${remainingHours}h${remainingMinutes}m`;
  }
}

export function GetWsStatus(wsStatus) {
  return (
    <div
      key={"WS-" + wsStatus}
      className={`${
        wsStatus === "connecting"
          ? "rounded mr-2 mt-2 h-3 w-3 bg-yellow-400"
          : wsStatus === "connected"
          ? "rounded mr-2 mt-2 h-3 w-3 bg-green-400"
          : wsStatus === "disconnected"
          ? "text-red-600 mr-2 mt-1"
          : "rounded mr-2 mt-2 h-3 w-3 bg-orange-600" // wsStatus === "error"
      }`}
      title={
        wsStatus === "disconnected" ? "Connection Lost!" : `Status: ${wsStatus}`
      }
    >
      {wsStatus === "disconnected" &&
        "Connection Lost! Retrying in 5 Seconds..."}
    </div>
  );
}
