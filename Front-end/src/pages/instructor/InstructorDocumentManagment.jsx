import { HiDotsVertical } from "react-icons/hi";
import React, { useEffect, useState } from "react";

import {
  FaEdit,
  FaExclamationTriangle,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/Authcontext";
import { MdClose } from "react-icons/md";
import Loading from "../../components/common/Loading";
import PageTitle from "../../utils/PageTitle";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
function InstructorDocumentManagment() {
  const { user } = useAuth();
  // ////////////////////////////////////////
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [size, setSize] = useState(null);
  const [lastModified, setLastModified] = useState(null);
  // //////////////////// Modal /////////////////
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // /////////////// Data /////////////////////
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, departmentsResponse, documentsResponse] =
          await Promise.all([
            fetch(`http://localhost:8080/api/courses_name/${user.id}`),
            fetch(`http://localhost:8080/api/departments_name/${user.id}`),
            fetch(
              `http://localhost:8080/api/documents/get/instructor_documents/${user.id}`
            ),
          ]);
        const [coursesData, departmentsData, documentsData] = await Promise.all(
          [
            coursesResponse.json(),
            departmentsResponse.json(),
            documentsResponse.json(),
          ]
        );
        if (
          !coursesResponse.ok ||
          !departmentsResponse.ok ||
          !documentsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        setCourses(coursesData?.data?.courses || []);
        setDepartments(departmentsData?.data?.departments || []);
        setFacultyName(departmentsData?.data?.facultyName || "");
        setDocuments(documentsData?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.facultyId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSize(null);
      setLastModified(null);
      return;
    }
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long", // Use 'long' to display the full month name
      day: "2-digit",
    }).format(new Date(file.lastModified));

    const fileType = file.type;

    // Exclude image files
    if (fileType.startsWith("image/")) {
      toast.error("Images are not allowed. Please upload a document.");
      return;
    }
    setSize(`${(file.size / 1024).toFixed(2)} KB`);
    setLastModified(formattedDate);
  };

  const handleModalSubmit = async () => {
    const course = courses.find((course) => course.id === selectedCourseId);

    if (!course) {
      toast.error("Course not found");
      return;
    }

    if (course.departmentId !== selectedDepartmentId) {
      toast.error("Invalid department-course combination");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "metadata",
        JSON.stringify({
          title,
          authorName: author,
          description,
          facultyId: user.facultyId,
          departmentId: selectedDepartmentId,
          courseId: selectedCourseId,
          size,
          lastModifiedDate: lastModified,
        })
      );
      if (!isEditing) {
        formData.append("userId", user.id);
      }
      const fileInput = document.getElementById("file");
      if (isEditing || fileInput?.files?.length > 0) {
        formData.append("document", fileInput.files[0]);
      } else {
        toast.error("Please select a file to upload.");
        return;
      }

      const url = isEditing
        ? `http://localhost:8080/api/documents/update/${selectedDocumentId}`
        : "http://localhost:8080/api/documents/add";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document.");
      }

      const result = await response.json();
      if (isEditing) {
        setDocuments(
          documents.map((doc) =>
            doc.id === selectedDocumentId ? result.data : doc
          )
        );
      } else {
        setDocuments([...documents, result.data]);
      }

      // Reset form and close modal
      resetForm();
      setShowModal(false);
      toast.success("Document uploaded successfully.");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDocument = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `http://localhost:8080/api/documents/delete/${documentToDelete}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete course");
      }

      setDocuments((prev) =>
        prev.filter((course) => course.id !== documentToDelete)
      );

      toast.success(result.message || "Document deleted successfully!");
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
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setSelectedDepartmentId("");
    setSelectedCourseId("");
  };
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <>
      <PageTitle title={"Document Management - SmartEduDocs"} />
      <div className="flex flex-col w-full h-full">
        <div className="sticky top-0 p-3 md:p-4 rounded-md z-10 bg-white shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Document Management
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
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              title="Click to add a new department"
            >
              + Add Document
            </button>
          </div>
        </div>

        {filteredDocuments.length != 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocuments.map((doc) => {
                return (
                  <div
                    key={doc.id}
                    className="bg-white shadow rounded-lg gap-2 p-4 relative flex flex-col "
                  >
                    <HiDotsVertical
                      className="absolute text-brightGreen top-2 right-2 cursor-pointer"
                      onClick={() =>
                        activeMenu === doc.id
                          ? setActiveMenu(null)
                          : setActiveMenu(doc.id)
                      }
                    />
                    {activeMenu === doc.id && (
                      <div className="absolute top-10 right-2 bg-gray-100 shadow rounded p-2">
                        <button
                          className="px-2 py-1 hover:bg-gray-200 w-full flex items-center"
                          onClick={() => {
                            setTitle(doc.title);
                            setDescription(doc.description);
                            setAuthor(doc.authorName);
                            setIsEditing(true);
                            setSelectedDocumentId(doc.id);
                            setShowModal(true);
                            setActiveMenu(null);
                          }}
                        >
                          <FaEdit className="text-green-500" /> Edit
                        </button>
                        <button
                          className="px-2 py-1 hover:bg-gray-200 flex items-center w-full"
                          onClick={() => {
                            setDocumentToDelete(doc.id);
                            setShowDeleteModal(true);
                            setActiveMenu(null);
                          }}
                        >
                          <FaTrashAlt className="text-green-500" /> Delete
                        </button>
                      </div>
                    )}
                    <Link to={`/document/${doc.id}`}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {doc.title}
                        </h3>
                        <div className="flex gap-4 items-center">
                          <p>
                            <span className="font-medium text-gray-800">
                              By:{" "}
                            </span>
                            {doc.authorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {doc.size}
                          </p>
                        </div>
                      </div>

                      {/* Document Details */}
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <span className="text-gray-800">Department of </span>
                          {doc.departmentName}, {doc.courseName}
                        </p>
                        <div>
                          <span className="font-medium text-gray-800">
                            Description:{" "}
                          </span>
                          <span className="text-sm">
                            {doc.description.slice(0, 70)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </ul>
          </div>
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
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md  w-11/12 max-w-3xl">
              {/* Increased max width */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Edit Document" : "Add Document"}
                </h3>
                <MdClose
                  className="w-6 h-6 cursor-pointer"
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
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Added gap for spacing */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      placeholder="Enter Document title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Author name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      placeholder="Enter Author name"
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
                    placeholder="Enter document description"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="file"
                    >
                      File
                    </label>
                    <input
                      type="file"
                      required={isEditing ? false : true}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      name="file"
                      onChange={(e) => {
                        handleFileChange(e);
                      }}
                      id="file"
                    />
                  </div>

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
                      value={selectedDepartmentId}
                      onChange={(e) => setSelectedDepartmentId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Courses
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.courseName}
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
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
                  onClick={handleDeleteDocument}
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
export default InstructorDocumentManagment;
