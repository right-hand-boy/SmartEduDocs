import React from "react";

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-br from-green-200 to-green-300 py-20 md:px-4 text-center"
    >
      <h2 className="text-5xl font-semibold text-gray-800 mb-12">
        How It Works
      </h2>
      <div className="w-fit mx-auto flex flex-col items-center justify-center gap-0 md:gap-16">
        {/* Step 1 */}
        <div className="flex flex-row items-center p-8 flex-wrap gap-12 transition-transform transform hover:scale-105 duration-300">
          <img
            src="/upload.webp" // Replace with actual image URL
            alt="Upload Documents"
            className="mb-4 w-80 h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="w-full md:max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
              Step 1: Upload Your Course Materials
            </h3>
            <p className="md:text-lg text-gray-600">
              Faculty members begin by uploading their course materials to the
              platform. This includes lecture notes, assignments, presentations,
              and other learning resources. These materials are organized and
              made easily accessible to all users.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex md:flex-row items-center p-8 flex-col-reverse gap-12 md:gap-16 transition-transform transform hover:scale-105 duration-300">
          <div className="w-full md:max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
              Step 2: Browse & Search for Materials
            </h3>
            <p className="md:text-lg text-gray-600">
              Once the documents are uploaded, both students and faculty can
              efficiently search and browse the materials. The search feature
              allows users to quickly find the documents they need, whether it's
              based on course names, keywords, or categories.
            </p>
          </div>
          <img
            src="/search.webp" // Replace with actual image URL
            alt="Browse & Search"
            className="mb-4 w-80 h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Step 3 */}
        <div className="flex flex-row items-center p-8 flex-wrap gap-12 md:gap-16 transition-transform transform hover:scale-105 duration-300">
          <img
            src="/download.jpg" // Replace with actual image URL
            alt="Download & Share"
            className="mb-4 w-80 h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="w-full md:max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
              Step 3: Download & Share Documents
            </h3>
            <p className="md:text-lg text-gray-600">
              After finding the required documents, users can either download
              them for offline access or share them with other members of the
              community. The sharing feature ensures that collaborative learning
              is made easier and more efficient.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
