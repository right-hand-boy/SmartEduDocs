import {
  UserIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import Footer from "../components/common/Footer";
import { FaClipboardCheck } from "react-icons/fa";

const TermsOfService = () => {
  return (
    <>
      <div className="relative bg-gray-900 text-white py-16 px-6">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-brightGreen mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-300">
            Please read these Terms of Service carefully before using
            SmartEduDocs.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 gap-12">
        {/* Introduction */}
        <div className="flex flex-col-reverse md:flex-row w-full gap-6 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <FaClipboardCheck className="h-7 w-7 text-brightGreen" />{" "}
              Introduction
            </h2>
            <p className="text-gray-600 mt-3">
              SmartEduDocs provides a document management system for educational
              purposes. These terms apply to all users of the platform.
            </p>
          </div>
          <img
            src={"./terms/intro.webp"}
            alt="Terms Illustration"
            className="rounded-lg shadow-lg h-48 w-fit mx-auto "
          />{" "}
        </div>
        <div className="flex flex-col md:flex-row w-full gap-6 items-center">
          {/* Acceptance of Terms */}
          <img
            src={"./terms/user.jpg"}
            alt="Agreement"
            className="rounded-lg shadow-lg h-48 w-fit mx-auto"
          />
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <UserIcon className="h-7 w-7 text-brightGreen" /> Acceptance of
              Terms
            </h2>
            <p className="text-gray-600 mt-3">
              By using our platform, you agree to abide by these terms. Changes
              to the terms will be communicated via email or notifications.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row w-full gap-6 items-center">
          {/* Security and Data Protection */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <ShieldCheckIcon className="h-7 w-7 text-brightGreen" /> Security
              & Data Protection
            </h2>
            <p className="text-gray-600 mt-3">
              We implement encryption, access controls, and audits to safeguard
              your documents and personal data.
            </p>
          </div>
          <img
            src={"./terms/high-tech.webp"}
            alt="Security"
            className="rounded-lg shadow-lg h-48 w-fit mx-auto "
          />
        </div>
        <div className="flex flex-col md:flex-row w-full gap-6 items-center">
          {/* Governing Law & Jurisdiction */}
          <img
            src={"./terms/law.webp"}
            alt="Law & Jurisdiction"
            className="rounded-lg shadow-lg h-48 w-fit mx-auto"
          />
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <GlobeAltIcon className="h-7 w-7 text-brightGreen" /> Governing
              Law & Jurisdiction
            </h2>
            <p className="text-gray-600 mt-3">
              These terms are governed by the applicable laws. Any disputes will
              be resolved through legal processes outlined by your institution.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsOfService;
