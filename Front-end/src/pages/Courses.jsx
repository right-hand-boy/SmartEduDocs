import React, { useEffect, useState } from "react";
import { DocumentIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import { FaExclamationTriangle, FaInfoCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../utils/PageTitle";
import Loading from "../components/common/Loading";
function Courses() {
  const [courses, setCourses] = useState([]);
  const [initialCourses, setInitialCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/courses", {
          method: "GET",
        });
        const result = await response.json();

        setCourses(result.data);
        setInitialCourses(result.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch Courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = initialCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // if (loading) return <Loading />;
  return (
    <>
      <PageTitle title={"Courses List - SmartEduDocs"} />
      <div className="h-full flex flex-col bg-gray-100 p-4">
        <div className="sticky top-0 bg-white shadow-md p-4 z-10 mb-4 rounded-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
              Courses List
            </h1>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full md:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <Link
                  to={`/course/${course.id}`}
                  key={index}
                  className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow hover:bg-gray-300 transition-colors"
                >
                  {/* Course Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">
                      {course.name[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {course.name}
                    </span>
                  </div>

                  {/* Course Description */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <DocumentTextIcon className="h-6" />
                    <span className="text-sm">
                      {course.description
                        ? course.description.slice(0, 50)
                        : "No description available"}
                    </span>
                  </div>

                  {/* Course Code */}
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaInfoCircle className="w-5 h-5" />
                    <strong className="font-medium">Course Code:</strong>{" "}
                    {course.courseCode || "N/A"}
                  </p>

                  {/* Documents Count */}
                  <p className="flex items-center gap-2 text-gray-600">
                    <DocumentIcon className="h-6" />
                    <span>{course.bookCount || 0} Documents</span>
                  </p>

                  {/* View Documents Button */}
                  <button className="text-sm text-green-500 hover:text-green-700 focus:outline-none">
                    View Documents
                  </button>
                </Link>
              ))}
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

export default Courses;
