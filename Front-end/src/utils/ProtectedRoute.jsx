import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ condition = false }) => {
  const { user } = useAuth();
  return !condition && user ? (
    <Outlet />
  ) : user && user.role === condition ? (
    <Outlet />
  ) : (
    <>
      {/* {toast.error("you are not authorized")} */}
      <Navigate to={"/"} />
    </>
  );
};

export default ProtectedRoute;
