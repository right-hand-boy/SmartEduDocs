import React from "react";
import { FaAngry, FaNetworkWired, FaSnowman } from "react-icons/fa";
import { FaShieldHeart } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-lightBeige">
      <div className="text-9xl text-brightGreen">
        <FaAngry />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-950">404</h1>
      <p className="text-2xl font-semibold text-gray-900">Page Not Found</p>
      <p className="mt-4 text-lg text-gray-800">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-8 px-6 py-3 text-white bg-brightGreen rounded-lg shadow-button hover:bg-darkCyan transition-colors"
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
