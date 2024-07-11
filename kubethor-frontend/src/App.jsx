import React, { useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import MainLayout from "./layouts/MainLayout";
import CreateResourcePage from "./pages/CreateResource/CreateResourcePage";
import { useGlobal } from "./GlobalState";
import ConfigMapPage from "./pages/ConfigMap/ConfigMapPage";
import DeploymentPage from "./pages/Deployments/DeploymentPage";
import PodPage from "./pages/Pods/PodPage";
import JobsPage from "./pages/Jobs/JobsPage";
import ServicePage from "./pages/Services/ServicePage";
import SecretsPage from "./pages/Secrets/SecretsPage";
import HpaPage from "./pages/HPA/HpaPage";
import IngressPage from "./pages/Ingress/IngressPage";
import EndpointPage from "./pages/Endpoint/EndpointPage";
import ServiceAccountPage from "./pages/ServiceAccount/ServiceAccountPage";
import PvcPage from "./pages/PVC/PvcPage";
import NamespacePage from "./pages/Namespace/NamespacePage";
import NodePage from "./pages/Node/NodePage";
import EventPage from "./pages/Event/EventPage";
import { API_BASE_URL, KubethorUserSessionId } from "./config";

const App = () => {
  const { isClusterConnected } = useGlobal();

  useEffect(() => {
    if (isClusterConnected) {
      const sessionRefreshInterval = setInterval(
        refreshSession,
        30 * 60 * 1000
      ); // Refresh every 30 minutes

      return () => clearInterval(sessionRefreshInterval);
    }
  }, [isClusterConnected]);

  const refreshSession = () => {
    fetch(API_BASE_URL + "/api/k8s/refresh-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionStorage.getItem(KubethorUserSessionId),
      },
    })
      .then((response) => response)
      .catch((error) => console.error("Error refreshing session:", error));
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              isClusterConnected ? <Navigate to="/pods" /> : <HomePage />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/pods"
            element={!isClusterConnected ? <Navigate to="/" /> : <PodPage />}
          />
          <Route
            path="/config-maps"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <ConfigMapPage />
            }
          />
          <Route
            path="/deployments"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <DeploymentPage />
            }
          />
          <Route
            path="/jobs"
            element={!isClusterConnected ? <Navigate to="/" /> : <JobsPage />}
          />
          <Route
            path="/services"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <ServicePage />
            }
          />
          <Route
            path="/secrets"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <SecretsPage />
            }
          />
          <Route
            path="/hpa"
            element={!isClusterConnected ? <Navigate to="/" /> : <HpaPage />}
          />
          <Route
            path="/ingresses"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <IngressPage />
            }
          />
          <Route
            path="/endpoints"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <EndpointPage />
            }
          />
          <Route
            path="/create-resource"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <CreateResourcePage />
            }
          />
          <Route
            path="/service-accounts"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <ServiceAccountPage />
            }
          />
          <Route
            path="/persistent-volume-claims"
            element={!isClusterConnected ? <Navigate to="/" /> : <PvcPage />}
          />
          <Route
            path="/namespaces"
            element={
              !isClusterConnected ? <Navigate to="/" /> : <NamespacePage />
            }
          />
          <Route
            path="/nodes"
            element={!isClusterConnected ? <Navigate to="/" /> : <NodePage />}
          />
          <Route
            path="/events"
            element={!isClusterConnected ? <Navigate to="/" /> : <EventPage />}
          />
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
