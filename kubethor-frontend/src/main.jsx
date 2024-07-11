import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GlobalProvider } from "./GlobalState.jsx";
import AlertMessage from "./components/commons/AlertMessage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
      <AlertMessage />
    </GlobalProvider>
  </React.StrictMode>
);
