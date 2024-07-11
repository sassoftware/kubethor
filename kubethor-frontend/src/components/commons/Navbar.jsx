import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import DarkModeThemeToggle from "./DarkModeThemeToggle";
import { useGlobal } from "../../GlobalState";
import StopClusterConnection from "./StopClusterConnection";
import NamespaceContext from "./NamespaceContext";
import K8sCommands from "./K8sCommands";

const Navbar = () => {
  const { isClusterConnected } = useGlobal();
  const [selectedMenu, setSelectedMenu] = useState("workload");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <header className="pb-6">
      <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4">
        <div className="flex justify-between items-center mx-auto">
          <div className="flex justify-start items-center">
            <NavLink to="/" className="flex mr-14">
              <img src={logo} className="mr-3 h-8" alt="kubethor Logo" />
              <span className="self-center hidden sm:flex text-2xl font-semibold whitespace-nowrap dark:text-white">
                Kubethor
              </span>
            </NavLink>
            {/* <!-- Main menu --> */}
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
              {isClusterConnected && (
                <ul className="flex flex-col mt-4 space-x-6 text-sm font-medium lg:flex-row xl:space-x-8 lg:mt-0">
                  <li>
                    <button
                      onClick={() => handleMenuClick("workload")}
                      className={`block ${
                        selectedMenu === "workload"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Workloads
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleMenuClick("config")}
                      className={`block ${
                        selectedMenu === "config"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Configurations
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleMenuClick("network")}
                      className={`block ${
                        selectedMenu === "network"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Network
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleMenuClick("storage")}
                      className={`block ${
                        selectedMenu === "storage"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Storage
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleMenuClick("accesscontrol")}
                      className={`block ${
                        selectedMenu === "accesscontrol"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Access Control
                    </button>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/unknown"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Cluster
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink
                      to="/namespaces"
                      onClick={() => handleMenuClick("unknown")}
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Namespaces
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/nodes"
                      onClick={() => handleMenuClick("unknown")}
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Nodes
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/events"
                      onClick={() => handleMenuClick("unknown")}
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Events
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/create-resource"
                      onClick={() => handleMenuClick("unknown")}
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Create Resource
                    </NavLink>
                  </li> */}
                </ul>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center lg:order-2">
            {isClusterConnected && <NamespaceContext />}
            {isClusterConnected && <K8sCommands />}
            <DarkModeThemeToggle />
            {isClusterConnected && <StopClusterConnection />}
          </div>
        </div>
      </nav>
      {/* <!-- Secondary menu --> */}
      {isClusterConnected && selectedMenu && (
        <nav className="fixed z-20 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4 top-16">
          <div className="flex justify-center items-center mx-auto">
            <ul className="flex space-x-6 text-xs font-medium">
              {selectedMenu === "workload" && (
                <>
                  <li>
                    <NavLink
                      to="/pods"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                      aria-current="page"
                    >
                      Pods
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/deployments"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Deployments
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/daemonsets"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      DaemonSets
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/statefulsets"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      StatefulSets
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/replicasets"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      ReplicaSets
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/cronjobs"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      CronJobs
                    </NavLink>
                  </li> */}
                </>
              )}
              {selectedMenu === "config" && (
                <>
                  <li>
                    <NavLink
                      to="/config-maps"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      ConfigMaps
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/secrets"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Secrets
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/hpa"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      HPA
                    </NavLink>
                  </li>
                </>
              )}
              {selectedMenu === "network" && (
                <>
                  <li>
                    <NavLink
                      to="/services"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Services
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/endpoints"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Endpoints
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/ingresses"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Ingresses
                    </NavLink>
                  </li>
                </>
              )}
              {selectedMenu === "storage" && (
                <>
                  <li>
                    <NavLink
                      to="/persistent-volume-claims"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Persistent Volume Claims
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/storage-classes"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Storage Classes
                    </NavLink>
                  </li> */}
                </>
              )}
              {selectedMenu === "accesscontrol" && (
                <>
                  <li>
                    <NavLink
                      to="/service-accounts"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Service Accounts
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/cluster-roles"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Cluster Roles
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/roles"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Roles
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/cluster-role-bindings"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Cluster Role Bindings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/role-bindings"
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded text-blue-700 dark:text-blue-500"
                          : "block text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white"
                      }
                    >
                      Role Bindings
                    </NavLink>
                  </li> */}
                </>
              )}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
