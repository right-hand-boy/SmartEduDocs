import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaBook,
  FaInfoCircle,
  FaBarcode,
  FaFolderOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/Authcontext";
import PageTitle from "../../utils/PageTitle";
import { Link } from "react-router-dom";

function FacultyCourseManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [facultyName, setFacultyName] = useState();
  const [departments, setDepartments] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const [coursesResponse, departmentsResponse] = await Promise.all([
          fetch(
            `http://localhost:8080/api/courses_in_faculty/${user.facultyId}`
          ),
          fetch(`http://localhost:8080/api/departments_name/${user.facultyId}`),
        ]);

        if (coursesResponse.ok && departmentsResponse.ok) {
          const coursesData = await coursesResponse.json();
          const departmentsData = await departmentsResponse.json();
          setFacultyName(coursesData.data.facultyName);
          setCourses(coursesData.data.courses);

          setDepartments(departmentsData.data.departments);
        } else {
          toast.error("Failed to fetch data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCourseCode("");
    setSelectedDepartment("");
    setIsEditing(false);
  };

  const handleModalSubmit = async () => {
    if (
      name.trim() &&
      description.trim() &&
      courseCode.trim() &&
      selectedDepartment
    ) {
      setLoading(true); // Start loading
      try {
        const method = isEditing ? "PATCH" : "POST";
        const body = {
          name,
          description,
          courseCode,
          facultyId: user.facultyId,
          departmentId: selectedDepartment,
          ...(isEditing && { id: courseToDelete }),
        };
        const response = await fetch("http://localhost:8080/api/course", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setCourses((prev) =>
            isEditing
              ? prev.map((course) =>
                  course.id === courseToDelete ? result.data : course
                )
              : [...prev, result.data]
          );
          toast.success(
            isEditing
              ? "Course updated successfully!"
              : "Course added successfully!"
          );
          resetForm();
          setShowModal(false);
        } else {
          const errorMessage = result?.data?.error || "Failed to save course.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while saving course.");
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const handleDeleteCourse = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:8080/api/course", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseToDelete }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete course");
      }

      setCourses((prev) =>
        prev.filter((course) => course.id !== courseToDelete)
      );

      toast.success(result.message || "Course deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Error deleting course. Please try again later."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <Loading />;

  return (
    <>
      <PageTitle title={"Faculty Course Management - SmartEduDocs"} />{" "}
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="sticky top-0 p-3 md:p-4 rounded-md z-10 bg-white shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Course Management
            </h1>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments..."
                className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none  transition"
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              title="Click to add a new department"
            >
              + Add Course
            </button>
          </div>
        </div>
        {/* Course List */}
        {filteredCourses.length != 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow rounded-lg gap-2 p-4 relative flex flex-col justify-between"
                >
                  <HiDotsVertical
                    className="absolute text-brightGreen top-2 right-2 cursor-pointer"
                    onClick={() =>
                      activeMenu === course.id
                        ? setActiveMenu(null)
                        : setActiveMenu(course.id)
                    }
                  />
                  {activeMenu === course.id && (
                    <div className="absolute top-10 right-2 bg-gray-100 shadow rounded p-2">
                      <button
                        className="px-2 py-1 hover:bg-gray-200 w-full flex items-center"
                        onClick={() => {
                          setName(course.name);
                          setDescription(course.description);
                          setCourseCode(course.courseCode);
                          setSelectedDepartment(course.departmentId);
                          setCourseToDelete(course.id);
                          setIsEditing(true);
                          setShowModal(true);
                          setActiveMenu(null);
                        }}
                      >
                        <FaEdit className="text-green-500" /> Edit
                      </button>
                      <button
                        className="px-2 py-1 hover:bg-gray-200 flex items-center w-full"
                        onClick={() => {
                          setCourseToDelete(course.id);
                          setShowDeleteModal(true);
                          setActiveMenu(null);
                        }}
                      >
                        <FaTrashAlt className="text-green-500" /> Delete
                      </button>
                    </div>
                  )}
                  <Link to={`/course/${course.id}`}>
                    <h3 className="text-lg font-bold flex items-center text-gray-700">
                      {course.name}
                    </h3>
                    <p className="my-1 block text-gray-600 font-semibold justify-self-start">
                      Department of {course.departmentName}
                    </p>
                    <p className="text-sm flex items-center text-gray-600">
                      {course.description.slice(0, 70)}
                    </p>
                    <p className="font-semibold flex items-center">
                      <FaBarcode className="mr-2 text-brightGreen" /> Course
                      code: {course.courseCode}
                    </p>
                    <p className="capitalize flex items-center">
                      <FaFolderOpen className="mr-2 text-brightGreen" />{" "}
                      {course.bookCount} documents
                    </p>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 md:max-w-3xl">
              {" "}
              {/* Increased max width */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Edit Course" : "Add Course"}
                </h3>
                <MdClose
                  className="w-6 h-6 cursor-pointer text-brightGreen"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalSubmit();
                }}
                className="h-[70vh] overflow-y-auto scrollbar-thin pr-4"
              >
                <div className="mb-4 grid grid-col-1 md:grid-cols-2 gap-4">
                  {" "}
                  {/* Added gap for spacing */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      placeholder="Enter course name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      placeholder="Enter course code"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none"
                    placeholder="Enter course description"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4 grid grid-col-1 md:grid-cols-2 gap-4">
                  {" "}
                  {/* Added gap for spacing */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Faculty
                    </label>
                    <input
                      type="text"
                      value={facultyName}
                      disabled
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none bg-gray-300"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option
                          className="hover:bg-gray-400"
                          key={department.id}
                          value={department.id}
                        >
                          {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-50 justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>
                Are you sure you want to delete this course? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCourse}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FacultyCourseManagement;
