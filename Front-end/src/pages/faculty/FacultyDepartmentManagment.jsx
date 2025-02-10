import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import {
  FaEdit,
  FaExclamationTriangle,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/Authcontext";
import PageTitle from "../../utils/PageTitle";
import { Link } from "react-router-dom";
function FacultyDepartmentManagement() {
  const { user } = useAuth();
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [facultyName, setFacultyName] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/departments/${user.facultyId}`
        ).then((res) => res.json());
        setFacultyName(response.data.facultyName);
        setDepartments(response.data.departments || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEditDepartment = async () => {
    if (!departmentName.trim()) {
      toast.warning("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const departmentData = {
      name: departmentName,
      description: departmentDescription,
      facultyId: user.facultyId,
      ...(isEditing && { id: isEditing }),
    };

    try {
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch("http://localhost:8080/api/department", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save department");
      }

      if (isEditing) {
        setDepartments((prev) =>
          prev.map((dept) => (dept.id === isEditing ? result.data : dept))
        );
        toast.success("Department updated successfully!");
      } else {
        setDepartments((prev) => [...prev, result.data]);
        toast.success("Department added successfully!");
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving department.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/department", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedDepartmentId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete department");
      }

      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== selectedDepartmentId)
      );

      toast.success(result.message || "Department deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Error deleting department. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDepartmentName("");
    setDepartmentDescription("");
    setIsEditing(null);
  };

  const filteredDepartments = departments.filter((department) =>
    department.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <PageTitle title={"Faculty Department Management - SmartEduDocs"} />{" "}
      <div className="flex flex-col h-full">
        <div className="sticky top-0 p-3 md:p-4 rounded-md z-10 bg-white shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Department Management
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
              + Add Department
            </button>
          </div>
        </div>

        {filteredDepartments.length != 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin md:pr-4 pr-22">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {" "}
              {filteredDepartments.map((department) => (
                <div
                  key={department.id}
                  className="bg-white flex flex-col shadow rounded-lg p-4 relative justify-between"
                >
                  <HiDotsVertical
                    className="absolute text-brightGreen top-2 right-2 cursor-pointer"
                    onClick={() =>
                      setActiveMenu((prev) =>
                        prev === department.id ? null : department.id
                      )
                    }
                  />
                  {activeMenu === department.id && (
                    <div className="absolute top-10 right-2 bg-gray-100 shadow rounded p-2">
                      <button
                        onClick={() => {
                          setDepartmentName(department.departmentName);
                          setDepartmentDescription(department.description);
                          setIsEditing(department.id);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 hover:bg-gray-200 w-full px-2 py-1"
                      >
                        <FaEdit className="text-green-500" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDepartmentId(department.id);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center gap-2 mt-2 hover:bg-gray-200 w-full px-2 py-1"
                      >
                        <FaTrashAlt className="text-green-500" /> Delete
                      </button>
                    </div>
                  )}
                  <Link to={`/departments/courses/${department.id}`}>
                    <h3 className="text-lg text-gray-700 font-bold justify-self-start">
                      {department.departmentName}
                    </h3>
                    <span className="my-1 block text-gray-600 font-semibold justify-self-start">
                      Faculty of {facultyName}
                    </span>
                    <p className="text-sm">
                      {department.description.slice(0, 150)}...
                    </p>
                    <p className="text-gray-700 mt-3 flex items-center gap-2">
                      {" "}
                      <FontAwesomeIcon
                        icon={faBookOpen}
                        className="text-gray-600"
                      />{" "}
                      {department.courseCount} courses{" "}
                    </p>{" "}
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
                  There are no faculties available.
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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-xl mb-4">
                {isEditing ? "Edit Department" : "Add Department"}
              </h2>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Department Name"
                className="border p-2 rounded w-full mb-4 bg-gray-200 focus:outline-none"
              />
              <textarea
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
                placeholder="Department Description"
                className="border p-2 rounded w-full mb-4 bg-gray-200 focus:outline-none"
              />
              <input
                type="text"
                value={facultyName}
                disabled
                placeholder="Department Name"
                className="border p-2 rounded w-full mb-4 bg-gray-200 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEditDepartment}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-50 justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>
                Are you sure you want to delete this department? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDepartment}
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

export default FacultyDepartmentManagement;
