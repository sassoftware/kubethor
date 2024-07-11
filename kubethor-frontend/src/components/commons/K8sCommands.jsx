import React, { useState } from "react";
import axios from "axios";
import { useGlobal } from "../../GlobalState";
import { API_BASE_URL, KubethorUserSessionId } from "../../config";

const K8sCommands = () => {
  const { clientCurrentNamepace } = useGlobal();
  const [isK8sCommandModalOpen, setIsK8sCommandModalOpen] = useState(false);
  const [yamlFile, setYamlFile] = useState(null);
  const [commandType, setCommandType] = useState("apply");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleYamlFileChange = (e) => setYamlFile(e.target.files[0]);
  const handleCommandTypeChange = (e) => {
    setCommandType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!yamlFile) {
      setError("Please select a YAML file");
      setLoading(false);
      return;
    }

    try {
      const fileContent = await readFileContent(yamlFile);
      const res = await axios.post(
        API_BASE_URL +
          `/api/k8s/resource-create-command/${clientCurrentNamepace}/${commandType}`,
        fileContent,
        {
          headers: {
            "Content-Type": "text/plain",
            "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
          },
        }
      );
      setResponse("Successful!");
      setLoading(false);
    } catch (err) {
      console.error("Error during request:", err);
      setError(err.response?.data || "An error occurred");
      setLoading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <button
        id="theme-toggle"
        type="button"
        className="p-2 mt-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => setIsK8sCommandModalOpen(true)}
      >
        <svg
          id="theme-toggle-light-icon"
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5z" />
        </svg>
      </button>
      {/* Modal Start */}
      {isK8sCommandModalOpen ? (
        <div
          className="fixed left-0 right-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full flex"
          id="edit-user-modal"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full h-full max-w-2xl px-4 md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold dark:text-white">
                  K8s Apply/Delete/Create Resources
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                  data-modal-toggle="edit-user-modal"
                  onClick={() => {
                    setIsK8sCommandModalOpen(false);
                    setResponse(null);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="file_input"
                      >
                        Upload file
                      </label>
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="resource_file_input"
                        accept=".yaml,.yml"
                        onChange={handleYamlFileChange}
                        required
                        type="file"
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select k8s Apply/Delete/Create
                      </label>
                      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                          <div className="flex items-center ps-3">
                            <input
                              type="radio"
                              value="create"
                              checked={commandType === "create"}
                              onChange={handleCommandTypeChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="horizontal-list-radio-license"
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Create
                            </label>
                          </div>
                        </li>
                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                          <div className="flex items-center ps-3">
                            <input
                              type="radio"
                              value="apply"
                              checked={commandType === "apply"}
                              onChange={handleCommandTypeChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="horizontal-list-radio-id"
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Apply
                            </label>
                          </div>
                        </li>
                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                          <div className="flex items-center ps-3">
                            <input
                              type="radio"
                              value="delete"
                              checked={commandType === "delete"}
                              onChange={handleCommandTypeChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="horizontal-list-radio-military"
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Delete
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-500">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Execute
                    {loading && ( // Conditionally render loader
                      <svg
                        className="inline w-4 h-4 ms-2 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-2.294 2.295A7.971 7.971 0 014 12H0c0 3.137 1.17 6 3.096 8.205L6 17.291z"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
              <div className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-500">
                {response && (
                  <div className="response">
                    <span>
                      <pre className="whitespace-normal text-green-500">
                        Response: {JSON.stringify(response, null, 2)}
                      </pre>
                    </span>
                  </div>
                )}
                {error && (
                  <div className="error">
                    <span>
                      <pre className="whitespace-normal text-red-500">
                        Error: {JSON.stringify(error, null, 2)}
                      </pre>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Modal End */}
    </div>
  );
};

export default K8sCommands;
