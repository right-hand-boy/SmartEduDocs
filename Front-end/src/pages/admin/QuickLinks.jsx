import React from "react";

const QuickLinks = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl text-center font-bold mb-4">Quick Links</h2>
      <div className="space-y-4">
        <button className="bg-blue-500 block w-full text-white px-4 py-2 rounded-md">
          View All Documents
        </button>
        <button className="bg-green-500 block w-full text-white px-4 py-2 rounded-md">
          Manage Roles
        </button>
        <button className="bg-purple-500 block w-full text-white px-4 py-2 rounded-md">
          Generate Reports
        </button>
      </div>
    </div>
  );
};

export default QuickLinks;
