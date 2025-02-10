import React from "react";
import {
  ComputerDesktopIcon,
  WrenchIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

function CoursesOverview() {
  // Departments defined using const
  const computingDepartments = [
    {
      name: "Software Engineering",
      icon: (
        <ComputerDesktopIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
    {
      name: "Computer Science",
      icon: (
        <ComputerDesktopIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
    {
      name: "Information Technology",
      icon: (
        <ComputerDesktopIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
    {
      name: "Information Systems",
      icon: (
        <ComputerDesktopIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
    {
      name: "Cyber Security",
      icon: (
        <ComputerDesktopIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
    {
      name: "Data Science",
      icon: (
        <AcademicCapIcon className="h-5 w-5 text-green-600 inline-block mr-2" />
      ),
    },
  ];

  const engineeringDepartments = [
    {
      name: "Computer Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Electrical Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Mechanical Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Civil Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Electromechanical Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Food Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
    {
      name: "Chemical Engineering",
      icon: <WrenchIcon className="h-5 w-5 text-green-600 inline-block mr-2" />,
    },
  ];

  return (
    <section className="bg-white py-16 px-4 text-center">
      <h2 className="text-3xl font-semibold mb-6">Our Departments</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Computing Department */}
        <div className="p-6 bg-gray-100 shadow-lg rounded-lg flex flex-col justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Department of Computing
            </h3>
            <p>
              Explore the departments focused on computer science and
              technology.
            </p>
          </div>
          <ul className="text-left space-y-2">
            {computingDepartments.map((department, index) => (
              <li
                key={index}
                className="text-green-600 uppercase flex items-center"
              >
                {department.icon}
                {department.name}
              </li>
            ))}
          </ul>
          <Link
            to={"/departments"}
            className="mt-auto bg-green-500 text-white py-2 px-6 rounded-lg"
          >
            Explore Departments
          </Link>
        </div>

        {/* Engineering Department */}
        <div className="p-6 bg-gray-100 shadow-lg rounded-lg flex flex-col justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Department of Engineering
            </h3>
            <p>
              Study the various engineering fields including electrical,
              mechanical, and civil engineering.
            </p>
          </div>
          <ul className="text-left space-y-2">
            {engineeringDepartments.map((department, index) => (
              <li
                key={index}
                className="text-green-600 uppercase flex items-center"
              >
                {department.icon}
                {department.name}
              </li>
            ))}
          </ul>
          <Link
            to={"/departments"}
            className="mt-auto bg-green-500 text-white py-2 px-6 rounded-lg"
          >
            Explore Departments
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoursesOverview;
