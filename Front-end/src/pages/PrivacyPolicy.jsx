import {
  ShieldCheckIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import Footer from "../components/common/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-brightGreen text-center mb-6">
            PRIVACY POLICY
          </h1>
          <p className="text-center text-gray-400 mb-10">
            Our personal statement, cookies, and third-party policies.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-brightGreen" />{" "}
                Introduction
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                This privacy policy explains how SmartEduDocs collects, uses,
                and protects user information. It applies to all users,
                including administrators, faculty heads, instructors, and
                students.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-brightGreen" />{" "}
                Information We Collect
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                We collect personal details such as names, email addresses, and
                user roles. Additionally, we gather document-related data (e.g.,
                uploaded files, metadata, comments) and system usage data (e.g.,
                login activity, access logs).
              </p>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <UsersIcon className="h-6 w-6 text-brightGreen" /> How We Use
                Your Information
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                <strong>Admin:</strong> Managing accounts and system operations.
                <br />
                <strong>Faculty Head:</strong> Reviewing materials and approving
                uploads.
                <br />
                <strong>Instructor:</strong> Sharing course documents.
                <br />
                <strong>Student:</strong> Accessing course-related documents.
              </p>
            </div>

            {/* Sharing of Information */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ShareIcon className="h-6 w-6 text-brightGreen" /> Sharing of
                Information
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                Data is shared within the system based on user roles.
                Third-party services such as cloud storage and analytics tools
                may also receive limited data.
              </p>
            </div>

            {/* Cookies and Tracking Technologies */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <GlobeAltIcon className="h-6 w-6 text-brightGreen" /> Cookies &
                Tracking
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                We use cookies for session management and analytics to enhance
                user experience.
              </p>
            </div>

            {/* User Rights and Choices */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-brightGreen" /> User Rights &
                Choices
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                Users can access, correct, or delete personal information and
                opt-out of non-essential communications.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <LockClosedIcon className="h-6 w-6 text-brightGreen" /> Data
                Security
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                We implement technical safeguards like encryption and firewalls,
                along with administrative controls such as role-based access and
                regular audits.
              </p>
            </div>

            {/* Retention Period */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-brightGreen" /> Retention
                Period
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                Data is retained according to institutional policies and
                document storage requirements.
              </p>
            </div>

            {/* International Users */}
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <GlobeAltIcon className="h-6 w-6 text-brightGreen" />{" "}
                International Users
              </h2>
            </div>
            <div>
              <p className="text-gray-300">
                We comply with global data protection regulations and
                cross-border data transfer policies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
