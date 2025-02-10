import React from "react";
import Footer from "../components/common/Footer";
import {
  FaLocationPin,
  FaAddressBook,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa6";

function ContactUs() {
  return (
    <>
      <div className="p-4">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-4 shadow-md rounded-md mb-6 grid md:grid-cols-2 gap-6">
            {/* Contact Info Section */}

            <div className="p-2">
              <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
              <p className="mb-4">
                If you have any questions or need assistance, feel free to reach
                out. We're here to help with anything you need!
              </p>
              <ul className="space-y-4 p-2">
                <li className="flex items-center gap-2">
                  <FaAddressBook className="mr-2 text-brightGreen text-xl" />
                  <strong>Address:</strong>{" "}
                  <span className="text-sm">
                    Bahir Dar University Poly Campus, Bahir Dar
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhone className="mr-2 text-brightGreen" />
                  <strong>Phone Number:</strong> +251 911 290 020
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="mr-2 text-brightGreen" />
                  <strong>Email:</strong> support@bahirdar.university.com
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold">Follow Us:</h4>
                <div className="flex space-x-4 mt-2 px-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-2xl text-brightGreen hover:text-blue-600"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-2xl text-brightGreen hover:text-blue-400"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-2xl text-brightGreen hover:text-pink-500"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
            {/* Contact Form Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Send a Message</h3>
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    E-mail Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-brightGreen font-bold text-white p-3 rounded-md w-full"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4 text-xl text-brightGreen flex items-center space-x-2">
              <span>
                <FaLocationPin />
              </span>

              <span>Our Location</span>
            </h4>
            <iframe
              src="https://maps.google.com/maps?q=Bahir%20Dar%20University%20Poly%20Campus,%20Bahir%20Dar,%20Ethiopia&t=k&output=embed"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: "0" }}
              allowFullScreen
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs;
