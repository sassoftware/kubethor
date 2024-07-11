import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { KubethorClientClusterConfigsLocalStorageKey } from "../../config";
import { useGlobal } from "../../GlobalState";
import { apiSendKubeconfigToServer } from "../../ApiUtils";

const HomePage = () => {
  const {
    setClusterConnected,
    setClientNamespaceList,
    setClientCurrentNamepace,
    showAlertNotificationDisplay,
  } = useGlobal();
  const [tableData, setTableData] = useState([]);
  const [isAddKubeconfigModalOpen, setIsAddKubeconfigModalOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    clusterName: "",
    clusterKubeconfig: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isFileUpload, setIsFileUpload] = useState(false);

  const handleDelete = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
    localStorage.setItem(
      KubethorClientClusterConfigsLocalStorageKey,
      JSON.stringify(updatedData)
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Create a new data object with the submitted form data
    const newClusterData = {
      clusterName: formData.clusterName,
      clusterKubeconfig: formData.clusterKubeconfig,
    };

    // Save the new data to localStorage
    let updatedData;
    if (isEditMode) {
      // Update existing entry
      updatedData = [...tableData];
      updatedData[editIndex] = newClusterData;
    } else {
      // Add new entry
      updatedData = [...tableData, newClusterData];
    }

    localStorage.setItem(
      KubethorClientClusterConfigsLocalStorageKey,
      JSON.stringify(updatedData)
    );

    // Update the table with the new data
    setTableData(updatedData);

    // Clear the form inputs
    setFormData({ clusterName: "", clusterKubeconfig: "" });
    setIsAddKubeconfigModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setIsFileUpload(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendKubeconfigToServer = async (kubeconfig) => {
    try {
      const response = await apiSendKubeconfigToServer(kubeconfig);

      // Handle the response as needed
      // For example, update state or show a success message

      // Update isClusterConnected to true
      setClusterConnected(true);
      setClientNamespaceList(response.namespaceList);
      setClientCurrentNamepace(response.currentContextNamespace);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error:", error);
      showAlertNotificationDisplay("Error: " + error.message);

      // Update isClusterConnected to false
      setClusterConnected(false);
    }
  };

  const handleSendKubeconfig = (kubeconfig) => {
    // Set the selected kubeconfig content to be displayed
    sendKubeconfigToServer(kubeconfig);
  };

  const handleEdit = (index) => {
    const itemToEdit = tableData[index];
    setFormData(itemToEdit);
    setIsAddKubeconfigModalOpen(true);
    setIsEditMode(true);
    setEditIndex(index);
    setIsFileUpload(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, clusterKubeconfig: event.target.result });
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const savedData =
      JSON.parse(
        localStorage.getItem(KubethorClientClusterConfigsLocalStorageKey)
      ) || [];
    setTableData(savedData);
  }, []);
  return (
    <>
      <main className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 max-w-full">
            {/* <!-- Card header --> */}
            <div className="items-center justify-between lg:flex">
              <div className="mb-4 lg:mb-0 mr-96">
                <div className="items-center justify-between mb-2 text-xl font-bold text-gray-900 dark:text-white ">
                  <a
                    href="#"
                    className="flex items-center text-2xl font-semibold dark:text-white"
                  >
                    <img src={logo} className="mr-4 h-11" alt="Kubethor Logo" />
                    <span>Kubethor</span>
                  </a>
                </div>
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Simplifying Kubernetes Management: An Innovative Approach to
                  Manage Resources.
                </span>
              </div>
              <div className="items-center sm:flex">
                <div className="flex items-center">
                  <button
                    id="dropdownDefault"
                    data-dropdown-toggle="dropdown"
                    className="mb-4 sm:mb-0 mr-4 inline-flex items-center font-semibold text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button"
                    onClick={() => setIsAddKubeconfigModalOpen(true)}
                  >
                    + Add Kubeconfig
                  </button>
                </div>
              </div>
            </div>
            {/* <!-- Table --> */}
            <div className="flex flex-col mt-6">
              <div className="overflow-x-auto rounded-lg">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white text-right"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800">
                        {tableData.map((item, index) => (
                          <tr
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 pointer-cursor"
                            key={index}
                            onClick={() =>
                              handleSendKubeconfig(item.clusterKubeconfig)
                            }
                          >
                            <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white font-semibold">
                              {item.clusterName}
                            </td>
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400 text-right">
                              <button
                                type="button"
                                data-modal-toggle="delete-user-modal"
                                onClick={() => handleDelete(index)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(index);
                                }}
                                className="inline-flex items-center px-3 py-2 ml-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L9.732 7.44l-2.56-.64a1 1 0 00-1.233 1.233l.64 2.56-6.303 6.303a1 1 0 000 1.414l3.414 3.414a1 1 0 001.414 0l6.303-6.303 2.56.64a1 1 0 001.233-1.233l-.64-2.56 4.854-4.854a2 2 0 000-2.828l-3.586-3.586zm-3.707 9.707l-4.24 4.24-1.06-1.06 4.24-4.24 1.06 1.06zm2.536-2.536l-4.24 4.24-1.06-1.06 4.24-4.24 1.06 1.06zm-8.294-8.294l4.24 4.24-1.06 1.06-4.24-4.24 1.06-1.06z" />
                                </svg>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Start */}
        {isAddKubeconfigModalOpen ? (
          <div
            className="fixed left-0 right-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full flex"
            id="edit-user-modal"
            aria-modal="true"
            role="dialog"
          >
            <div className="relative w-full h-full max-w-2xl px-4 md:h-auto">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                {/* <!-- Modal header --> */}
                <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
                  <h3 className="text-xl font-semibold dark:text-white">
                    {isEditMode
                      ? "Edit Kubeconfig File"
                      : "Add Kubeconfig File"}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                    data-modal-toggle="edit-user-modal"
                    onClick={() => {
                      setIsAddKubeconfigModalOpen(false);
                      setIsEditMode(false);
                      setFormData({ clusterName: "", clusterKubeconfig: "" });
                      setEditIndex(null);
                      setIsFileUpload(false);
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
                <form onSubmit={handleFormSubmit}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Name
                        </label>
                        <input
                          type="text"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                          name="clusterName"
                          value={formData.clusterName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-span-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Content
                        </label>

                        {isFileUpload ? (
                          <input
                            type="file"
                            // accept=".yaml,.yml"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          />
                        ) : (
                          <textarea
                            value={formData.clusterKubeconfig}
                            onChange={handleInputChange}
                            rows="4"
                            name="clusterKubeconfig"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          ></textarea>
                        )}
                        <div className="mb-2">
                          <button
                            type="button"
                            className={`inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white mt-3 ${
                              isFileUpload
                                ? "bg-blue-600 hover:bg-blue-800"
                                : "bg-gray-500 hover:bg-gray-600"
                            } rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900`}
                            onClick={() => setIsFileUpload(true)}
                          >
                            Upload File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Modal footer --> */}
                  <div className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        {/* Modal End */}
      </main>
    </>
  );
};

export default HomePage;
