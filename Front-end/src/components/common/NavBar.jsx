import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import {
  HomeIcon,
  BookmarkIcon,
  AcademicCapIcon,
  UsersIcon,
  InformationCircleIcon,
  UserCircleIcon, // Changed to UserCircleIcon
} from "@heroicons/react/24/outline"; // Heroicons
import Logo from "./Logo";
import LogoutModal from "./LogoutModal";
import { BookOpenIcon } from "@heroicons/react/20/solid";

function NavBar({ isHeroInView }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  // Handle logout confirmation
  const handleLogout = () => {
    logout(); // Call the logout function from context (or your logic here)
    setIsModalOpen(false); // Close the modal after logout
  };
  const close = () => {
    setIsModalOpen(false); // Close the modal
  };
  return (
    <nav
      className={`${
        isHeroInView ? "bg-transparent" : "bg-gray-800 shadow-md"
      } text-white px-4 py-1 w-full transition-all ease-in-out duration-300 z-50`}
    >
      <div className="flex justify-between items-center">
        <div className="self-center flex gap-4 items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars className="text-brightGreen text-3xl transition-transform duration-300" />
          </button>
          <Logo />
        </div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 transition-all ease-in-out duration-300">
          <li className="hover:text-green-700 px-4 py-2 cursor-pointer rounded transition-colors duration-300">
            <Link to={"/documents"}>Documents</Link>
          </li>
          <li className="hover:text-green-700 px-4 py-2 cursor-pointer rounded transition-colors duration-300">
            <Link to={"/courses"}>Courses</Link>
          </li>
          <li className="hover:text-green-700 cursor-pointer px-4 py-2 rounded transition-colors duration-300">
            <Link to={"/departments"}>Departments</Link>
          </li>
          <li className="hover:text-green-700 px-4 py-2 cursor-pointer rounded transition-colors duration-300">
            <Link to="/services">Services</Link>
          </li>
          <li className="flex items-center hover:text-green-700 cursor-pointer px-4 py-2 rounded transition-colors duration-300">
            <Link to="/about">About</Link>
          </li>
        </ul>
        {user ? (
          <div className="self-center">
            <Link
              to={`/dashboard/${user.role}`}
              className="flex gap-1 items-center"
            >
              <div className="h-8 rounded-full flex items-center justify-center w-8 bg-brightGreen font-extrabold text-white text-lg">
                {user.name[0].toUpperCase()}
              </div>
              <p className="capitalize font-semibold hidden md:block">
                {user.name.slice(0, 8)}
              </p>
            </Link>
          </div>
        ) : (
          <div className="self-center hover:bg-green-700 px-2 py-1 font-bold bg-deepGreen w-fit rounded transition-all duration-300">
            <Link to={"/signup"}>Sign Up</Link> {/* Sign Up button */}
          </div>
        )}
      </div>
      {/* Mobile Menu (Visible when menu is toggled) */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 w-full shadow-lg h-screen  left-0 bg-gray-800 z-50 p-4 pt-1 transition-all duration-500 ease-in-out">
          <div className="overflow-y-auto no-scrollbar flex flex-col py-4 h-full">
            <div className="flex gap-4 justify-self-start justify-between items-center">
              {/* Mobile Menu Button */}

              <Logo />
              <button
                className="md:hidden text-white"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <FaTimes className="text-brightGreen text-3xl transition-transform duration-300" />
              </button>
            </div>
            {user != null && (
              <div className="flex flex-col items-center mt-4 p-4 mb-6 bg-gray-700 rounded-lg shadow-lg">
                <div className="text-white flex justify-center items-center text-4xl font-extrabold w-16 h-16 rounded-full overflow-hidden bg-brightGreen border-2 mb-4">
                  {user.name[0].toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            )}
            <div className="bg-black inset-0 opacity-60 z-10"></div>
            {/* Overlay for better user interaction */}
            <ul className="md:hidden flex flex-col space-y-4 items-start justify-start mt-4 text-center text-white py-4">
              {user && (
                <li className="w-full">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                  >
                    <AcademicCapIcon className="h-6 w-6" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}
              <li className="w-full">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/documents"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                >
                  <BookOpenIcon className="h-6 w-6" />
                  <span>Documents</span>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/courses"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                >
                  <BookmarkIcon className="h-6 w-6" />
                  <span>Courses</span>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/departments"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                >
                  <HomeIcon className="h-6 w-6" />
                  <span>Departments</span>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="/services"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                >
                  <UsersIcon className="h-6 w-6" />
                  <span>Services</span>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  to="#"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 bg-gray-700 w-full"
                >
                  <InformationCircleIcon className="h-6 w-6" />
                  <span>About</span>
                </Link>
              </li>
            </ul>

            <div className="mt-auto">
              {user ? (
                <div className="p-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to={"/signup"}
                    className="w-full block text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Register
                  </Link>
                  <Link
                    to={"/login"}
                    className="w-full block text-center mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && <LogoutModal close={close} handleLogout={handleLogout} />}
    </nav>
  );
}

export default NavBar;
