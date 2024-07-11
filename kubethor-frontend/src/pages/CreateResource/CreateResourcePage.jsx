import { useState } from "react";
import { useGlobal } from "../../GlobalState";
import { API_BASE_URL, KubethorUserSessionId } from "../../config";

const CreateResourcePage = () => {
  const { clientCurrentNamepace, setClientCurrentNamepaceError } = useGlobal(); // Ensure consistent naming convention
  const [resourceType, setResourceType] = useState("");
  const [resourceContent, setResourceContent] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // This page is not having websocket, so set setClientCurrentNamepaceError=""
  setClientCurrentNamepaceError("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resourceType.trim() || !resourceContent.trim()) {
      // Input validation
      setResponseMessage("Resource Type and Content are required.");
      return;
    }

    let requestBody;
    try {
      requestBody = JSON.parse(resourceContent);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setResponseMessage("Invalid JSON content." + error);
      return;
    }

    const apiUrl =
      API_BASE_URL +
      `/api/k8s/resource-create/${resourceType}/${clientCurrentNamepace}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
        },
        body: JSON.stringify(requestBody), // Directly use resourceContent as the body.
      });

      if (response.ok) {
        // Handle success (e.g., show a success message).
        setResponseMessage("Resource created successfully!");

        // Clear form fields after success
        setResourceType("");
        setResourceContent("");
      } else {
        // Handle error (e.g., show an error message).
        const errorResponse = await response.text();
        setResponseMessage("Server Error - " + errorResponse);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseMessage("An error occurred while creating the resource.");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 min-w-full">
          {/* <!-- Card header --> */}
          <div className="items-center justify-between lg:flex mb-5">
            <div className="mb-4 lg:mb-0 mr-96">
              <div className="items-center justify-between mb-2 text-xl font-bold text-gray-900 dark:text-white ">
                <a
                  href="#"
                  className="flex items-center text-2xl font-semibold dark:text-white"
                >
                  <span>Create Resources</span>
                </a>
              </div>
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                Create Resources like Pods, Deployments, Configmap ...
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Namespace
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                  id="namespaceSelect"
                  value={clientCurrentNamepace}
                  disabled
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Resource Type
                </label>
                <select
                  required
                  id="resourceSelect"
                  onChange={(e) => setResourceType(e.target.value)}
                  value={resourceType}
                  className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option key="" value="" disabled>
                    Select Your Resource Type
                  </option>
                  <option key="Deployment" value="Deployment">
                    Deployment
                  </option>
                  <option key="ConfigMap" value="ConfigMap">
                    ConfigMap
                  </option>
                  <option key="Pod" value="Pod">
                    Pod
                  </option>
                </select>
              </div>
              <div className="col-span-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Resource Content (JSON)
                </label>
                <textarea
                  required
                  id="message"
                  onChange={(e) => setResourceContent(e.target.value)}
                  value={resourceContent}
                  name="bodyContent"
                  placeholder='{
  "metadata": {
    "name": "my-configmap",
    "namespace": "my-namespace"
  },
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}'
                  rows="12"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save
              </button>
            </div>
          </form>
          {responseMessage && (
            <div className="text-sm font-normal pt-4 text-red-400">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateResourcePage;
