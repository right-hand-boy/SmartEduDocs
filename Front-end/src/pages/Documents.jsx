import React, { useEffect, useState } from "react";
import PageTitle from "../utils/PageTitle";
import { FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../components/common/Loading";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8080/api/documents/get/all",
          {
            method: "GET",
          }
        ).then((res) => res.json());
        if (!response.success) {
          throw new Error("Failed to fetch data");
        }
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(documents);
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <PageTitle title={"Documents List - SmartEduDocs"} />
      <div className="flex flex-col w-full h-full p-4">
        <div className="sticky top-0 p-3 md:p-4 rounded-md z-10 bg-white shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Documents
            </h1>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none  transition"
              />
            </div>
          </div>
        </div>

        {filteredDocuments.length != 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => {
                return (
                  <li key={doc.id} className="bg-white shadow rounded-lg ">
                    <Link
                      to={`/document/${doc.id}`}
                      className="relative flex flex-row items-start h-full"
                    >
                      {/* Image Section */}
                      <div className="self-stretch w-36 overflow-hidden rounded-md rounded-r-none">
                        <img
                          src={doc.coverImageUrl || "/pragmatic_programmer.jpg"}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 bg-gray-100"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col justify-between flex-grow p-2">
                        <div>
                          {/* Title and Author */}
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {doc.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <p>
                              <span className="font-medium text-gray-800">
                                By:{" "}
                              </span>
                              {doc.uploadedBy}
                            </p>
                            <p className="ml-auto">
                              <span className="font-medium text-gray-800">
                                Size:{" "}
                              </span>
                              {doc.size}
                            </p>
                          </div>
                        </div>

                        {/* Document Details */}
                        <div className="text-sm text-gray-700 space-y-">
                          <p>
                            <span className="text-gray-800 font-medium">
                              Department of{" "}
                            </span>
                            {doc.departmentName}, {doc.courseName}
                          </p>
                          {/* Document Details */}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : loading ? (
          <Loading />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div>
              <FaExclamationTriangle className="text-red-800 w-10 h-10 mx-auto mb-4" />
              <div className="flex items-center space-x-3">
                <p className="text-lg font-semibold text-red-800">
                  There are no documents available.
                </p>
              </div>
              <p className="mt-2 text-gray-700">
                Please try the following suggestions:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-gray-700">
                <li>Check your internet connection.</li>
                <li>Ensure the server is running.</li>
                <li>Verify your query and try again.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Documents;
