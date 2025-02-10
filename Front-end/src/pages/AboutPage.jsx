import React from "react";
import { FaUsers, FaBullseye, FaCheckCircle } from "react-icons/fa";
import Footer from "../components/common/Footer";

function AboutPage() {
  return (
    <>
      {/* About Us Section */}
      <div className="bg-gray-100">
        <div className="bg-gray-800 text-center py-12 px-6">
          <h1 className="text-4xl font-bold text-white">About Us</h1>
          <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
            We provide cutting-edge document management solutions to streamline
            workflow, enhance collaboration, and ensure data security.
          </p>
        </div>

        {/* Two Column Content */}
        <div className="container mx-auto py-12 px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Ensuring Secure & Efficient Document Handling
              </h2>
              <p className="mt-4 text-gray-600">
                Our document management system provides businesses with seamless
                storage, retrieval, and sharing of documents. Stay organized
                with smart categorization, role-based access control, and
                real-time collaboration.
              </p>
            </div>
            <div>
              <img
                src="./about.webp"
                alt="Document Management"
                className="rounded-lg shadow-lg h-80"
              />
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-white py-12 px-6">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-center text-gray-600 max-w-lg mx-auto mt-2">
              A team of professionals dedicated to providing top-notch document
              management solutions.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-8">
              <TeamMember
                name="Biniyam kefyalew"
                position="CEO"
                img="https://via.placeholder.com/200"
              />
              <TeamMember
                name="Firehiwot Wonddemeneh"
                position="CTO"
                img="https://via.placeholder.com/200"
              />
              <TeamMember
                name="Bereket Asusa"
                position="Lead Developer"
                img="https://via.placeholder.com/200"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center py-12 px-6 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            Enhancing Productivity & Security
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Our solutions help businesses and educational institutions grow by
            optimizing document workflows.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaUsers}
              title="Professional Team"
              description="Expert support for seamless document management."
            />
            <FeatureCard
              icon={FaBullseye}
              title="Target-Oriented"
              description="Designed to meet organizational needs efficiently."
            />
            <FeatureCard
              icon={FaCheckCircle}
              title="Success Guarantee"
              description="Secure and scalable document solutions for all."
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <Icon className="text-4xl text-brightGreen mb-3" />
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Team Member Component
function TeamMember({ name, position, img }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
      <img src={img} alt={name} className="w-24 h-24 rounded-full mb-4" />
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="text-gray-600">{position}</p>
    </div>
  );
}

export default AboutPage;
