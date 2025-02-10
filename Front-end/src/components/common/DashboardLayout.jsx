import React, { useEffect, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import MobileDashboard from "../mobile/MobileDashboard";

function DashboardLayout() {
  const location = useLocation();
  const [isBelowMedium, setIsBelowMedium] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsBelowMedium(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {!isBelowMedium ? (
        <div className="flex h-full bg-gray-100">
          {/* Sidebar */}
          <div className="md:block hidden">
            <SideBar />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <Outlet />
          </main>
        </div>
      ) : null}
      {location.pathname !== "/dashboard" && isBelowMedium && (
        <div className="flex h-full bg-gray-100 p-4">
          <Outlet />
        </div>
      )}
      {location.pathname === "/dashboard" ? <MobileDashboard /> : null}
    </>
  );
}

export default DashboardLayout;
