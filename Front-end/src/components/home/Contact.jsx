import React, { useState } from "react";
import { EnvelopeIcon, UserIcon, PencilIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

function Contact() {
  // Contact Section state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:biniyamkefyalew1@gmail.com?subject=contacting support for more information&body=${encodeURIComponent(
      formData.name + formData.message
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <section className="bg-gray-100 relative py-16 px-4 text-center bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Have questions, feedback, or need assistance? Send us a message, and
          we’ll get back to you as soon as possible.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        {/* Name Field */}
        <div className="flex items-center border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          <UserIcon className="h-6 w-6 text-gray-400 mr-3" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full focus:outline-none"
            required
          />
        </div>

        {/* Email Field */}
        <div className="flex items-center border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          <EnvelopeIcon className="h-6 w-6 text-gray-400 mr-3" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full focus:outline-none"
            required
          />
        </div>

        {/* Message Field */}
        <div className="flex items-start border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          <PencilIcon className="h-6 w-6 text-gray-400 mr-3 mt-1" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="6"
            className="w-full focus:outline-none"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <span className="mr-2">Send Message</span>
        </button>
      </form>
    </section>
  );
}

export default Contact;
