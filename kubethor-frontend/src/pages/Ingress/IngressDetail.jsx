import React, { useEffect, useState } from "react";
import { apiGetResource } from "../../ApiUtils";
import { useGlobal } from "../../GlobalState";

const IngressDetail = ({ isOpen, onClose, resourceName }) => {
  const { clientCurrentNamepace, showAlertNotificationDisplay } = useGlobal();
  const [resourceDetail, setResourceDetail] = useState("");

  const getResourceDetails = async () => {
    try {
      const response = await apiGetResource(
        "Ingress",
        clientCurrentNamepace,
        resourceName
      );

      if (response.status === 200) {
        setResourceDetail(response.data);
      } else {
        setResourceDetail({});
      }
    } catch (error) {
      showAlertNotificationDisplay(
        "An error occurred while getting the resource" + error
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      getResourceDetails();
    }
  }, [isOpen, resourceName]);

  return (
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
        {resourceName}
      </h5>
      <button
        type="button"
        data-drawer-hide="drawer-right-example"
        aria-controls="drawer-right-example"
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
          ></path>
        </svg>
        <span className="sr-only">Close menu</span>
      </button>
      <h3 className="p-2 text-base font-medium text-gray-900 dark:text-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700">
        DETAIL
      </h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">Created At</td>
              <td className="px-6 py-4">
                {resourceDetail?.metadata?.creationTimestamp}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">Name</td>
              <td className="px-6 py-4">{resourceDetail?.metadata?.name}</td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">Namespace</td>
              <td className="px-6 py-4">
                {resourceDetail?.metadata?.namespace}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">Labels</td>
              <td className="px-6 py-4">
                {resourceDetail?.metadata?.labels ? (
                  <div>
                    {Object.entries(resourceDetail.metadata.labels).map(
                      ([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {key} = {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  "No labels available"
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">Annotations</td>
              <td className="px-6 py-4">
                {resourceDetail?.metadata?.annotations ? (
                  <div>
                    {Object.entries(resourceDetail.metadata.annotations).map(
                      ([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {key} = {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  "No annotations available"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="p-2 text-base font-medium text-gray-900 dark:text-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700">
        Rules
      </h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {resourceDetail?.spec?.rules ? (
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Host
                </th>
                <th scope="col" className="px-6 py-3">
                  Path
                </th>
                <th scope="col" className="px-6 py-3">
                  Link
                </th>
                <th scope="col" className="px-6 py-3">
                  Backends
                </th>
              </tr>
            </thead>
            <tbody>
              {resourceDetail.spec.rules.map((rule, ruleIndex) => (
                <React.Fragment key={ruleIndex}>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td
                      className="px-6 py-4"
                      rowSpan={rule.http.paths.length + 1}
                    >
                      {rule.host}
                    </td>
                  </tr>
                  {rule.http.paths.map((path, pathIndex) => (
                    <tr
                      key={pathIndex}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{path.path}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`http://${rule.host}${path.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-500 hover:underline"
                        >
                          {`http://${rule.host}${path.path}`}
                        </a>
                      </td>
                      <td className="px-6 py-4">{`${path.backend.service.name}:${path.backend.service.port.number}`}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          "No Rules available"
        )}

        <h3 className="p-2 text-base font-medium text-gray-900 dark:text-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700">
          Load-Balancer Ingress Points
        </h3>

        {resourceDetail?.status?.loadBalancer?.ingress ? (
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Hostname
                </th>
                <th scope="col" className="px-6 py-3">
                  IP
                </th>
              </tr>
            </thead>
            <tbody>
              {resourceDetail.status.loadBalancer.ingress.map(
                (ingress, ingressIndex) => (
                  <tr
                    key={ingressIndex}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{ingress.hostname || "-"}</td>
                    <td className="px-6 py-4">{ingress.ip || "-"}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          "No Load-Balancer Ingress Points available"
        )}
      </div>
    </div>
  );
};

export default IngressDetail;
