import React from "react";
import { useGlobal } from "../../GlobalState";

const NamespaceContext = () => {
  const {
    clientCurrentNamepace,
    clientNamespaceList,
    setClientCurrentNamepace,
    clientCurrentNamepaceError,
  } = useGlobal();

  const handleNamespaceChange = (event) => {
    const newValue = event.target.value;
    // Update the global state with the new value
    setClientCurrentNamepace(newValue);
    // console.log("Namespace Changed: " + newValue);
  };

  const getNamespaceStatus = (containerData) => {
    if (clientCurrentNamepaceError !== "") {
      return (
        <span title={clientCurrentNamepaceError}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="flex-shrink-0 inline w-4 h-4 mr-2 mb-1 text-yellow-300"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
        </span>
      );
    }
    return "";
  };

  return (
    <div className="mr-3 -mb-1 hidden sm:block">
      {getNamespaceStatus()}
      <select
        value={clientCurrentNamepace}
        onChange={handleNamespaceChange}
        className="p-2 text-base font-semibold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {clientNamespaceList.map((namespace) => (
          <option key={namespace} value={namespace}>
            {namespace}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NamespaceContext;
