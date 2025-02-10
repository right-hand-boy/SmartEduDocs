import React from "react";
import { Link } from "react-router-dom";

function MobileDepartments({ departments }) {
  return (
    <div className="md:hidden w-full bg-gray-800 text-white px-4 pb-8 pt-4 overflow-y-auto h-full no-scrollbar">
      <ul className="space-y-4 mt-6">
        {departments.map((department, index) => (
          <li key={index} className="w-full">
            <Link
              to={`/departments/courses/${department.id}`}
              className="cursor-pointer py-3 px-6 block bg-gray-700 hover:bg-gray-600 rounded-lg text-center"
            >
              {department.departmentName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MobileDepartments;
