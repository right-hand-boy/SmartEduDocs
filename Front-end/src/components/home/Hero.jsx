import React from "react";
import NavBar from "../common/NavBar";
import {
  FaBook,
  FaFileAlt,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaClipboard,
  FaBookOpen,
  FaCertificate,
  FaScroll,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Hero = React.forwardRef((props, ref) => {
  const iconInfo = [
    { icon: <FaBook />, label: "Library Resources" },
    { icon: <FaFileAlt />, label: "Department Files" },
    { icon: <FaChalkboardTeacher />, label: "Teaching Materials" },
    { icon: <FaGraduationCap />, label: "Student Resources" },
    { icon: <FaClipboard />, label: "Reports and Forms" },
    { icon: <FaBookOpen />, label: "Open Educational Resources" },
    { icon: <FaCertificate />, label: "Certificates and Awards" },
    { icon: <FaScroll />, label: "Historical Records" },
  ];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-screen pb-16 pt-28 md:pt-16 px-4 gap-16 bg-gray-800 text-white flex items-center justify-center flex-wrap"
    >
      {/* Left Text Section */}
      <div className="w-full px-6 md:max-w-xl">
        <h1 className="text-4xl mb-4 pt-5 md:pt-0 flex items-center flex-wrap relative">
          <FaBook className="text-brightGreen text-5xl md:text-6xl absolute -top-2 md:left-0 right-0 -translate-y-full md:-translate-x-full " />
          Welcome to{" "}
          <span className="font-extrabold text-brightGreen ml-2">
            SmartEduDocs
          </span>
        </h1>
        <p className="text-lg mb-6">
          Streamline the management and sharing of department and course
          documents with ease.
        </p>
        <div className="w-full flex flex-wrap items-center gap-6">
          <Link
            to="/documents"
            className="bg-brightGreen text-white px-4 py-2  hover:bg-deepGreen transition-all duration-300 rounded-sm"
          >
            View Documents
          </Link>
          <Link
            to="/signup"
            className="bg-deepGreen text-white px-4 py-2  hover:bg-brightGreen transition-all duration-30 rounded-sm"
          >
            Sign up
          </Link>
        </div>
      </div>
      {/* Right Image Section (Person using laptop) */}
      <div className="relative mt-8">
        <img
          src="/hero.png"
          alt="Person using laptop"
          className="h-80 w-80 object-cover rounded-full"
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          {iconInfo.map((item, index) => (
            <div
              key={index}
              className="group absolute w-16 z-0 h-16 rounded-full text-2xl bg-brightGreen shadow-md flex items-center justify-center text-white border-4 border-white animate-spin-slow"
              style={{
                transform: `rotate(${index * 45}deg) translate(140px) rotate(-${
                  index * 45
                }deg)`,
              }}
            >
              {item.icon}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-max z-50 mb-2 text-sm bg-deepGreen text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Optional Hero Image (background image) */}
      <div className="absolute bottom-6 left-6"></div>
    </div>
  );
});

export default Hero;
