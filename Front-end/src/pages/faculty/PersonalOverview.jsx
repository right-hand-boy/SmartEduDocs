import React from "react";

const PersonalOverview = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Personal Overview</h2>
      <div className="flex flex-col space-y-4">
        <p>
          Total Courses Assigned:{" "}
          <span className="font-bold text-blue-600">5</span>
        </p>
        <p>
          Total Documents Uploaded:{" "}
          <span className="font-bold text-green-600">20</span>
        </p>
      </div>
    </div>
  );
};

export default PersonalOverview;
