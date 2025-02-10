import React from "react";

const UploadSummary = () => {
  const uploads = [
    { course: "Physics 101", document: "Lecture 1 Notes", downloads: 25 },
    { course: "Chemistry 202", document: "Assignment 3", downloads: 18 },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Upload Summary</h2>
      <ul className="space-y-2">
        {uploads.map((upload, index) => (
          <li key={index} className="border-b py-2">
            <p>
              {upload.course}: {upload.document} -{" "}
              <span className="text-green-600 font-bold capitalize">
                {upload.downloads} downloads
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadSummary;
