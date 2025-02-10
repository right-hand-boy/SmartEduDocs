import React, { useEffect, useState } from "react";
import PageTitle from "../utils/PageTitle";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";
import MobileDepartments from "../components/mobile/MobileDepartments";
import { toast } from "react-toastify";

const Aside = ({ departments }) => (
  <aside className="w-max absolute top-0 md:relative hidden md:block bg-gray-800 text-white px-4 pb-8 pt-4 overflow-y-auto no-scrollbar">
    <div>
      <ul className="grid gap-2 items-stretch">
        {departments.map((department, index) => (
          <li key={index} className="w-full">
            <NavLink
              to={`/departments/courses/${department.id}`}
              className={({ isActive }) =>
                `cursor-pointer py-2 px-4 block hover:bg-gray-700 rounded ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {department.departmentName}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBelowMedium, setIsBelowMedium] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/departments_names",
          { method: "GET" }
        );
        const data = await response.json();
        setDepartments(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch departments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsBelowMedium(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {!isBelowMedium ? (
        <div className="flex h-full bg-gray-100">
          {/* Sidebar */}
          <Aside departments={departments} />

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <Outlet />
          </div>
        </div>
      ) : null}

      {location.pathname !== "/departments" && isBelowMedium && (
        <div className="h-full flex-1 p-4 overflow-y-hidden scrollbar-thin">
          <Outlet />
        </div>
      )}

      {location.pathname === "/departments" && (
        <MobileDepartments departments={departments} />
      )}
    </>
  );
}

export default Departments;
