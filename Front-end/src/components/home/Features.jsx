import React from "react";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

function Features() {
  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Fun Fact</h2>
        <p className="text-lg text-gray-600">
          Explore the key features of our system that make management effortless
          and effective.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Department Management */}
        <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Department Management
          </h3>
          <p className="text-gray-600 text-center">
            Manage department details seamlessly.
          </p>
        </div>

        {/* Course Management */}
        <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center items-center h-16 w-16 bg-green-100 rounded-full mx-auto mb-4">
            <AcademicCapIcon className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Course Management
          </h3>
          <p className="text-gray-600 text-center">
            Organize and track courses efficiently.
          </p>
        </div>

        {/* Document Management */}
        <div className="bg-green-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-center items-center h-16 w-16 bg-purple-100 rounded-full mx-auto mb-4">
            <DocumentIcon className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Document Management
          </h3>
          <p className="text-gray-600 text-center">
            Securely store and manage documents.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
