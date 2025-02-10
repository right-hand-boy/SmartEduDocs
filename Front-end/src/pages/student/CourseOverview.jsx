import React from "react";

const CourseOverview = () => {
  const courses = [
    { id: 1, name: "Math 101", materials: 10 },
    { id: 2, name: "Biology 202", materials: 8 },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 min-w-fit">
      <h2 className="text-xl font-bold mb-4">Course Overview</h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id} className="border-b py-2">
            <p>
              {course.name} -{" "}
              <span className="text-blue-600">
                {course.materials} materials
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseOverview;
