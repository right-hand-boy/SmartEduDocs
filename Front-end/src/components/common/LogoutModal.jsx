import React from "react";

function LogoutModal({ close, handleLogout }) {
  return (
    <div className="fixed inset-0 flex items-center text-black w-screen justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-between">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Yes, Log Out
          </button>
          <button
            onClick={close}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
