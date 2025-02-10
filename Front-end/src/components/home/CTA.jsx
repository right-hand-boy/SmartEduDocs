import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-300 text-white py-16 px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Get Started with Document Management
      </h2>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Join now to manage, and access your course documents in one place. Stay
        organized and efficient with our easy-to-use platform.
      </p>
      <div className="space-x-4">
        <Link
          to={"/signup"}
          className="bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white py-3 px-8 rounded-lg text-xl transition-all duration-300"
        >
          Sign Up
        </Link>
        <Link
          to={"/login"}
          className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg text-xl hover:bg-white hover:text-green-600 transition-all duration-300"
        >
          Login
        </Link>
      </div>
    </section>
  );
}

export default CTA;
