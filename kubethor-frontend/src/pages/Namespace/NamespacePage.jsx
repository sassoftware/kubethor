import React, { useState } from "react";
import { useGlobal } from "../../GlobalState";
import { API_WS_URL, GetWsStatus, formatDuration } from "../../config";
import { apiDeleteResource } from "../../ApiUtils";
import ResourceEditor from "../Commons/ResourceEditor";
import useWebSocketResourceList from "../../components/hooks/useWebSocketResourceList";
import useSearchResourceList from "../../components/hooks/useSearchResourceList";
import useResourceDeletion from "../../components/hooks/useResourceDeletion";
import NamespaceDetail from "./NamespaceDetail";

const NamespacePage = () => {
  const {
    clientCurrentNamepace,
    showAlertNotificationDisplay,
    setClientCurrentNamepaceError,
  } = useGlobal();
  const { wsStatus, data } = useWebSocketResourceList(
    `${API_WS_URL}/api/k8s/ws/resource-watcher/list/Namespace/${clientCurrentNamepace}`,
    clientCurrentNamepace,
    showAlertNotificationDisplay,
    setClientCurrentNamepaceError
  );
  const { searchTerm, handleSearch, filterData } = useSearchResourceList(); // Use the useSearch hook
  const filteredData = filterData(data); // Filter data based on the search term
  const handleDeleteResource = useResourceDeletion(
    apiDeleteResource,
    showAlertNotificationDisplay
  );
  const [selectedResourceName, setSelectedResourceName] = useState(null);

  // Resource Editor
  const [isResourceEditorOpen, setIsResourceEditorOpen] = useState(false);
  const openResourceEditorDrawer = (resourceName) => {
    setSelectedResourceName(resourceName);
    setIsResourceEditorOpen(true);
  };
  const closeResourceEditorDrawer = () => {
    setIsResourceEditorOpen(false);
    setSelectedResourceName(null);
  };

  // Resource Detail
  const [isResourceDetailDrawerOpen, setIsResourceDetailDrawerOpen] =
    useState(false);
  const openResourceDetailDrawer = (resourceName) => {
    setSelectedResourceName(resourceName);
    setIsResourceEditorOpen(false);
    setIsResourceDetailDrawerOpen(true);
  };
  const closeResourceDetailDrawer = () => {
    setIsResourceDetailDrawerOpen(false);
    setSelectedResourceName(null);
  };

  return (
    <>
      {/* Table Start */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        {/* <!-- Card header --> */}
        <div className="items-center justify-between lg:flex">
          <div className="mb-4 lg:mb-0 flex">
            {GetWsStatus(wsStatus)}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Namespaces
            </h3>
          </div>
          <div className="items-center sm:flex">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                      stroke="currentColor"
                      fill="none"
                      fillRule="evenodd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 datepicker-input"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Table --> */}
        <div className="flex flex-col mt-6">
          <div className="overflow-x-auto rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Name
                      </th>

                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Age
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredData.length === 0 ? (
                      <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 pointer-cursor">
                        <td className="p-4 text-base font-semibold text-red-700 whitespace-nowrap dark:text-red-400">
                          Nothing Found!
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 pointer-cursor"
                          key={item.name}
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id="checkbox-633293"
                                aria-describedby="checkbox-1"
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="checkbox-633293"
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td
                            className="p-4 text-sm font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400"
                            onClick={() => openResourceDetailDrawer(item.name)}
                          >
                            {item.name}
                          </td>
                          <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {formatDuration(item.age)}
                          </td>
                          <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {item.status.phase}
                          </td>
                          <td className="p-4 space-x-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() =>
                                    openResourceEditorDrawer(item.name)
                                  }
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                  <path
                                    fillRule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                              <div className="mr-2">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() =>
                                    handleDeleteResource(
                                      "Namespace",
                                      clientCurrentNamepace,
                                      item.name
                                    )
                                  }
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table End  */}
      {/* Drawer Start */}
      {isResourceDetailDrawerOpen && (
        <NamespaceDetail
          isOpen={isResourceDetailDrawerOpen}
          onClose={closeResourceDetailDrawer}
          resourceName={selectedResourceName}
        />
      )}
      {/* Drawer End */}
      {/* Resource Editor Start */}
      {isResourceEditorOpen && (
        <ResourceEditor
          isOpen={isResourceEditorOpen}
          onClose={closeResourceEditorDrawer}
          resourceType="Namespace"
          resourceName={selectedResourceName}
        />
      )}
      {/* Resource Editor End */}
    </>
  );
};

export default NamespacePage;
