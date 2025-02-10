import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-green-100 py-16 px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <button
              onClick={() => toggleAccordion(0)}
              className="w-full text-left text-xl font-semibold flex items-center"
            >
              How do I upload a document?
              {openIndex === 0 ? (
                <ChevronUpIcon className="h-5 w-5 ml-2 text-green-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 ml-2 text-green-600" />
              )}
            </button>
            {openIndex === 0 && (
              <p className="mt-4 text-gray-600">
                To upload a document, go to the "Documents" section and click
                the "Upload" button. Choose the file you want to upload and
                select the appropriate course and department.
              </p>
            )}
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <button
              onClick={() => toggleAccordion(1)}
              className="w-full text-left text-xl font-semibold flex items-center"
            >
              Can I share documents with others?
              {openIndex === 1 ? (
                <ChevronUpIcon className="h-5 w-5 ml-2 text-green-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 ml-2 text-green-600" />
              )}
            </button>
            {openIndex === 1 && (
              <p className="mt-4 text-gray-600">
                Yes, you can share documents with other users by providing them
                access within the document's settings. You can also download and
                send documents to others via email.
              </p>
            )}
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <button
              onClick={() => toggleAccordion(2)}
              className="w-full text-left text-xl font-semibold flex items-center"
            >
              How do I search for a document?
              {openIndex === 2 ? (
                <ChevronUpIcon className="h-5 w-5 ml-2 text-green-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 ml-2 text-green-600" />
              )}
            </button>
            {openIndex === 2 && (
              <p className="mt-4 text-gray-600">
                To search for a document, use the search bar available at the
                top of the page. You can filter by course, department, or
                document type.
              </p>
            )}
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <button
              onClick={() => toggleAccordion(3)}
              className="w-full text-left text-xl font-semibold flex items-center"
            >
              What types of documents can I upload?
              {openIndex === 3 ? (
                <ChevronUpIcon className="h-5 w-5 ml-2 text-green-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 ml-2 text-green-600" />
              )}
            </button>
            {openIndex === 3 && (
              <p className="mt-4 text-gray-600">
                You can upload various types of documents including PDFs, Word
                files, Excel sheets, and PowerPoint presentations. Ensure the
                documents are relevant to your courses.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
