import React from "react";
import {
  FaBook,
  FaArchive,
  FaUsers,
  FaLock,
  FaSearch,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Footer from "../components/common/Footer";

function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md p-6 text-center">
        <h1 className="text-3xl font-bold text-brightGreen">Our Services</h1>
      </header>

      <main className="flex-1 p-6">
        <p className="text-lg text-gray-700 text-center mb-12">
          We provide document management solutions for faculties, departments,
          and educational institutions.
        </p>

        <div className="mt-6 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={FaBook}
            title="Course Materials"
            description="Upload, organize, and share course resources easily."
          />
          <ServiceCard
            icon={FaArchive}
            title="Department Archives"
            description="Store and retrieve department records securely."
          />
          <ServiceCard
            icon={FaUsers}
            title="Faculty Collaboration"
            description="Share and collaborate on documents with faculty members."
          />
          <ServiceCard
            icon={FaLock}
            title="Secure Storage"
            description="Ensure data integrity with secure cloud storage."
          />
          <ServiceCard
            icon={FaSearch}
            title="Easy Search"
            description="Find documents quickly with advanced search options."
          />
          <ServiceCard
            icon={FaCloudUploadAlt}
            title="Automated Backups"
            description="Keep your files safe with automatic cloud backups."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white relative p-6 rounded-lg shadow flex flex-col items-center text-center">
      <Icon className="text-5xl text-brightGreen mb-3 absolute top-0 -translate-y-1/2 -translate-x-1/2 left-1/2 bg-white p-2 rounded-b-full shadow-md" />
      <h2 className="text-xl font-semibold text-brightGreen mt-6">{title}</h2>
      <p className="text-gray-600 mt-4">{description}</p>
    </div>
  );
}

export default Services;
