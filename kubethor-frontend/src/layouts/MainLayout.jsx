import { Outlet } from "react-router-dom";
import Navbar from "../components/commons/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div
          id="main-content"
          className="relative w-full mx-auto h-full overflow-y-auto bg-gray-50 dark:bg-gray-900"
        >
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
