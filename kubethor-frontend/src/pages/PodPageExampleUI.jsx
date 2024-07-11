import { useState } from "react";

const PodPageExampleUI = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  return (
    <>
      {/* Table Start */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        {/* <!-- Card header --> */}
        <div className="items-center justify-between lg:flex">
          <div className="mb-4 lg:mb-0">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Pod for Namespace
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
                        Namespace
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Containers
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Node
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Restart
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      >
                        Created On
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
                    <tr
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 pointer-cursor"
                      onClick={() => openDrawer()}
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-633293"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-633293" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          React UI Kit
                        </div>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Html templates
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        React JS
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center">
                          <div
                            className="h-2.5 w-2.5 rounded bg-green-400 mr-2"
                            title="hello"
                          ></div>
                          <div
                            className="h-2.5 w-2.5 rounded bg-red-600 mr-2"
                            title="hello2"
                          ></div>
                        </div>
                      </td>
                      <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        Start developing with an open-source library of over
                        450+ UI components, sections, and pages built with the
                        utility classes from Tailwind CSS and designed in Figma.
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        5
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
                        8/4/2024, 7:52:09 pm
                      </td>

                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                          In progress
                        </span>
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table End  */}
      {/* Drawer Start */}
      {isDrawerOpen && (
        <div
          id="drawer-right-example"
          className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-1/2 dark:bg-gray-800 transform-none"
          tabIndex="-1"
          aria-labelledby="drawer-right-label"
          aria-modal="true"
          role="dialog"
        >
          <h5
            id="drawer-right-label"
            className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
          >
            <svg
              className="w-4 h-4 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
            </svg>
            Right drawer
          </h5>
          <button
            type="button"
            data-drawer-hide="drawer-right-example"
            aria-controls="drawer-right-example"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              ></path>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Color
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Silver</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Silver</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Silver</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Drawer End */}
    </>
  );
};

export default PodPageExampleUI;
