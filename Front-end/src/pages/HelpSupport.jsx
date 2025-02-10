import React from "react";
import Footer from "../components/common/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

function HelpSupport() {
  return (
    <>
      <div className="px-6 py-16 text-center">
        <img
          src="./help.jpg"
          alt="Help Support"
          className="w-fit h-56 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">
          Are you facing any problems?
        </h2>
        <p className="mb-4">
          Get in touch with us for assistance. We're here to help!
        </p>

        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="text-blue-600 text-2xl" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="text-blue-400 text-2xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="text-pink-500 text-2xl" />
          </a>
          {/* Add more social media links as needed */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HelpSupport;
