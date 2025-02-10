import { DocumentIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaInfoCircle, FaSearch } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";
import PageTitle from "../../utils/PageTitle";
function CoursesInDepartment() {
  const [courses, setCourses] = useState([]);
  const { departmentId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/courses_in_department/${
            departmentId || "678933ac0e6a013db8c84617"
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());
        if (response.success || response.ok) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [departmentId]);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <Loading />;
  return (
    <>
      <PageTitle
        title={
          `${courses[0]?.departmentName} course lists` || "No courses available"
        }
      />
      <div className="h-full flex flex-col bg-gray-100">
        {filteredCourses.length > 0 ? (
          <>
            <div className="sticky top-0 p-4 z-10 mb-4 bg-white shadow rounded-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-800 text-center md:text-left">
                  {courses[0]?.departmentName || "No courses available"}
                </h1>
                <div className="relative w-full md:w-auto">
                  <FaSearch className="w-5 h-5 absolute top-2.5 left-3 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full md:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {" "}
                {filteredCourses.map((course, index) => (
                  <Link
                    to={`/course/${course.id}`}
                    key={index}
                    className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow hover:bg-gray-300 transition-colors"
                  >
                    {/* Course Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">
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
          </>
        ) : (
          <div className="flex justify-center w-full items-center h-full">
            <div>
              <FaExclamationTriangle className="text-red-800 w-10 h-10 mx-auto mb-4" />
              <div className="flex items-center space-x-3">
                <p className="text-lg font-semibold text-red-800">
                  There are no courses available.
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

export default CoursesInDepartment;
