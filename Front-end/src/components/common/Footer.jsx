import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Company Info */}
        <div>
          <Logo />
          <p className="text-gray-400 mt-3">
            Manage documents and collaborate with ease. Empowering students and
            faculty in academic excellence.
          </p>
        </div>

        {/* Column 2: Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/help" className="text-gray-400 hover:text-white">
                Help & Support
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">
            Email:{" "}
            <a
              href="mailto:support@bahirdar.university.com"
              className="hover:text-white"
            >
              support@bahirdar.university.com
            </a>
          </p>
          <p className="text-gray-400">Phone: +251 911 290 020</p>
          <div className="mt-6">
            <a
              href="https://facebook.com"
              className="text-gray-400 hover:text-white mr-4"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-white mr-4"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              className="text-gray-400 hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-gray-400">
          © 2025{" "}
          <span className="text-brightGreen font-bold font-mono">
            SmartEduDocs
          </span>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
