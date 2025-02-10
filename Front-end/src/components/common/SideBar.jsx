import React, { useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { NavLink } from "react-router-dom";
import { routes } from "../../data/data";
import LogoutModal from "./LogoutModal";
function SideBar() {
  const { user, logout } = useAuth(); // Assuming logout is a function from context
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  // Filter routes based on the user's role
  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(user.role)
  );

  // Handle logout confirmation
  const handleLogout = () => {
    logout(); // Call the logout function from context (or your logic here)
    setIsModalOpen(false); // Close the modal after logout
  };
  const close = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <aside className="w-max bg-gray-800 text-gray-800 flex flex-col h-full overflow-y-auto no-scrollbar">
      {/* User Profile Section */}
      <div className="flex flex-col items-center p-6">
        <div className="text-white flex justify-center items-center text-4xl font-extrabold w-14 h-14 rounded-full overflow-hidden bg-brightGreen border-2">
          {user.name[0].toUpperCase()}
        </div>
        <h3 className="mt-4 text-lg capitalize font-semibold text-white">
          {user.name}
        </h3>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6">
        <ul className="space-y-4">
          {filteredRoutes.map((route, index) => (
            <li key={index}>
              <NavLink
                to={route.path}
                className={(isActive) =>
                  `flex items-center space-x-3 p-2 ${
                    isActive ? "bg-gray-700" : ""
                  } hover:bg-gray-700 rounded-lg`
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
      <div className="p-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Log Out
        </button>
      </div>

      {/* Modal for logout confirmation */}
      {isModalOpen && <LogoutModal close={close} handleLogout={handleLogout} />}
    </aside>
  );
}

export default SideBar;
