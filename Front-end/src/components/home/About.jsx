import React from "react";

function About() {
  function handleScroll() {
    const section = document.getElementById("how-it-works");
    if (section) {
      const sectionPosition = section.offsetTop - 50; // Calculate position with offset
      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });
    }
  }
  return (
    <div className="flex flex-wrap px-6 py-16 gap-16 md:gap-6 justify-around bg-gradient-to-br from-green-200 via-green-100 to-green-300 rounded-lg">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-16">
        <div className="max-w-sm">
          <h1 className="text-2xl font-extrabold mb-4">
            <span className="text-brightGreen">Department and Course</span>{" "}
            Management
          </h1>
          <p className="text-gray-500 text-sm">
            Our system provides an efficient and seamless solution for managing
            department and course documents. Simplify your workflows with our
            user-friendly platform.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-600 border-r-8 border-green-500 row-span-2 self-center text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium">SUBSCRIBERS TRUST US</h3>
            <p className="text-3xl font-bold mt-8">250+</p>
          </div>
          <div className="bg-gray-600 border-r-8 border-green-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium">DOCUMENTS STORED</h3>
            <p className="text-3xl font-bold mt-8">60k+</p>
          </div>
          <div className="bg-gray-600 border-r-8 border-green-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium">YEARS OF EXPERIENCE</h3>
            <p className="text-3xl font-bold mt-8">25+</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap md:justify-between gap-16 md:gap-28 items-center md:-translate-y-16">
        <img
          src="/about.jpg"
          alt="About us"
          className="w-full flex-grow md:w-96 rounded-lg"
        />
        <div className="max-w-xs">
          <p className="text-gray-600">
            Transform the way you manage your department and course-related
            documentation. Our system is designed to boost productivity and
            ensure data security.
          </p>
          <button
            onClick={handleScroll}
            className="py-2 px-4 text-white font-bold bg-brightGreen hover:bg-darkGreen rounded-sm mt-6"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
