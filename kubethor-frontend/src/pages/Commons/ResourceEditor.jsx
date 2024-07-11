import React, { useEffect, useState, useRef } from "react";
import { apiGetResource, apiUpdateResource } from "../../ApiUtils";
import { useGlobal } from "../../GlobalState";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

const ResourceEditor = ({ isOpen, onClose, resourceName, resourceType }) => {
  const { clientCurrentNamepace, showAlertNotificationDisplay } = useGlobal();
  const [resourceDetail, setResourceDetail] = useState("");
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  const getResourceDetails = async () => {
    try {
      const response = await apiGetResource(
        resourceType,
        clientCurrentNamepace,
        resourceName
      );

      if (response.status === 200) {
        setResourceDetail(JSON.stringify(response.data, null, 2)); // pretty-print JSON
      } else {
        setResourceDetail("Error getting resource: " + resourceName);
      }
    } catch (error) {
      showAlertNotificationDisplay(
        "An error occurred while getting the resource: " + error
      );
    }
  };

  const updateResourceDetails = async (resourceContent) => {
    try {
      const response = await apiUpdateResource(
        resourceType,
        clientCurrentNamepace,
        resourceContent
      );

      if (response.status === 200) {
        showAlertNotificationDisplay(
          resourceType + " updated successfully: " + resourceName
        );
      } else {
        showAlertNotificationDisplay(
          "Error updating resource: " + resourceName
        );
      }
    } catch (error) {
      showAlertNotificationDisplay(
        "An error occurred while updating the resource: " + error
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedResource = editorRef.current.get();
    updateResourceDetails(JSON.stringify(updatedResource));
  };

  useEffect(() => {
    if (isOpen) {
      getResourceDetails();
    }
  }, [isOpen, resourceName, resourceType]);

  useEffect(() => {
    if (editorContainerRef.current && !editorRef.current) {
      editorRef.current = new JSONEditor(editorContainerRef.current, {
        modes: ["code", "tree", "view", "form", "text"],
        mode: "tree", // or 'tree', 'view', 'form', 'text', etc.
      });
    }

    if (editorRef.current && resourceDetail) {
      editorRef.current.updateText(resourceDetail);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [resourceDetail]);

  return (
    <div
      id="drawer-bottom-example"
      className="fixed bottom-0 left-0 right-0 z-40 w-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
      tabIndex="-1"
      aria-labelledby="drawer-bottom-label"
    >
      <h5
        id="drawer-bottom-label"
        className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
      >
        <svg
          className="w-4 h-4 me-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        {resourceType}: {resourceName}
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
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div ref={editorContainerRef} style={{ height: "400px" }}></div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceEditor;
