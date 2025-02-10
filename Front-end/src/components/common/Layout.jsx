import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen custom-scrollbar">
      <NavBar />
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <Outlet />
        {/* <Footer /> */}
      </main>
    </div>
  );
};

export default Layout;
