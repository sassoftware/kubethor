import React, { useEffect } from "react";
import { useGlobal } from "../../GlobalState";

const AlertMessage = () => {
  const { isAlertNotificationDisplayed, showAlertNotificationDisplay } =
    useGlobal();

  useEffect(() => {
    let timer;
    if (isAlertNotificationDisplayed) {
      timer = setTimeout(() => {
        showAlertNotificationDisplay("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isAlertNotificationDisplayed]);

  return (
    isAlertNotificationDisplayed != "" && (
      <div
        id="toast-danger"
        className="z-50 fixed flex items-center w-full max-w-xl p-4 space-x-4 text-gray-500 bg-white border border-gray-300 dark:border-gray-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
        role="alert"
      >
        {/* <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span className="sr-only">Error icon</span>
        </div> */}
        <div className="ms-3 text-sm font-normal pl-4">
          {isAlertNotificationDisplayed}
        </div>
      </div>
    )
  );
};

export default AlertMessage;
