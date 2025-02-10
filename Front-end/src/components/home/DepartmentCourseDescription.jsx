import React from "react";

function DepartmentCourseDescription() {
  return (
    <div className="py-16 px-6 bg-green-200">
      {/* Department Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 justify-center">
        <img
          src="/department.jpg"
          alt="Department"
          className="w-full md:w-1/3 h-72 object-cover rounded-lg shadow-md"
        />
        <div className="text-center md:text-left max-w-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Department</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis, itaque hic a in animi quis tempora quod suscipit eaque
            architecto non aliquam esse consequatur voluptas soluta tenetur
            asperiores nostrum? Dolores!
          </p>
        </div>
      </div>

      {/* Course Section */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-6 justify-center">
        <img
          src="/course.jpg"
          alt="Course"
          className="w-full md:w-1/3 h-72 object-cover rounded-lg shadow-md"
        />
        <div className="text-center md:text-left max-w-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            molestiae sequi delectus hic! Quas dolores recusandae eligendi
            culpa. Vel molestiae aliquid temporibus iste error omnis recusandae
            similique quibusdam cumque ab.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DepartmentCourseDescription;
