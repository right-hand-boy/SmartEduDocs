import React, { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { NavLink } from "react-router-dom";
import { routes } from "../../data/data";

function MobileDashboard() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <aside className="md:hidden w-full bg-gray-800 text-white flex flex-col h-full overflow-y-auto no-scrollbar p-4">
      {/* User Profile Section */}
      <div className="flex flex-col items-center p-4 mb-6 bg-gray-700 rounded-lg shadow-lg">
        <div className="text-white flex justify-center items-center text-4xl font-extrabold w-16 h-16 rounded-full overflow-hidden bg-brightGreen border-2 mb-4">
          {user.name[0].toUpperCase()}
        </div>
        <h3 className="text-xl font-semibold text-white">{user.name}</h3>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mb-6">
        <ul className="space-y-4">
          {filteredRoutes.map((route, index) => (
            <li key={index}>
              <NavLink
                to={route.path}
                className={(isActive) =>
                  `flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 ${
                    isActive ? "bg-gray-700" : "bg-gray-800"
                  }`
                }
              >
                {route.icon && <route.icon className="h-6 w-6 text-white" />}
                <span className="text-gray-200">{route.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Log Out
        </button>
      </div>

      {/* Modal for logout confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default MobileDashboard;
