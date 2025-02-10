import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/common/Loading";
import PageTitle from "../../utils/PageTitle";
function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("http://localhost:8080/api/faculties");
        const result = await response.json();
        if (response.ok) {
          setFaculties(result.data);
        } else {
          toast.error("Failed to fetch faculties.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching faculties.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFaculties();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsEditing(false);
  };

  const handleModalSubmit = async () => {
    if (name.trim() && description.trim()) {
      setLoading(true); // Start loading
      try {
        const method = isEditing ? "PATCH" : "POST";
        const body = {
          name,
          description,
          ...(isEditing && { id: facultyToDelete }),
        };

        const response = await fetch("http://localhost:8080/api/faculty", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setFaculties((prev) =>
            isEditing
              ? prev.map((faculty) =>
                  faculty.id === facultyToDelete ? result.data : faculty
                )
              : [...prev, result.data]
          );
          toast.success(
            isEditing
              ? "Faculty updated successfully!"
              : "Faculty added successfully!"
          );
          resetForm();
          setShowModal(false);
        } else {
          toast.error("Failed to save faculty.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while saving faculty.");
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const deleteFaculty = async (id) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`http://localhost:8080/api/faculty`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete faculty");
      }
      setFaculties((prev) => prev.filter((faculty) => faculty.id !== id));
      setShowDeleteModal(false);
      toast.success("Faculty deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting faculty.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const filteredFaculties = faculties.filter((faculty) =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <Loading />;
  return (
    <>
      <PageTitle title={"Faculty Management - SmartEduDocs"} />
      <div className="flex flex-col h-full">
        <div className="sticky top-0 p-3 md:p-4 rounded-md z-10 bg-white shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Faculty Management
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
              + Add Faculty
            </button>
          </div>
        </div>

        {/* Faculty List */}
        {filteredFaculties.length != 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto h-full scrollbar-thin md:pr-4 pr-2">
            {filteredFaculties.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white flex gap-2 flex-col shadow rounded-lg p-4 relative justify-between"
              >
                <HiDotsVertical
                  className="absolute text-brightGreen top-2 right-2 cursor-pointer"
                  onClick={() =>
                    activeMenu === faculty.id
                      ? setActiveMenu(null)
                      : setActiveMenu(faculty.id)
                  }
                />
                {activeMenu === faculty.id && (
                  <div className="absolute top-10 right-2 bg-gray-100 shadow rounded p-2">
                    <button
                      className="px-2 py-1 hover:bg-gray-200 flex items-center w-full"
                      onClick={() => {
                        setName(faculty.name);
                        setDescription(faculty.description);
                        setFacultyToDelete(faculty.id);
                        setIsEditing(true);
                        setShowModal(true);
                        setActiveMenu(null);
                      }}
                    >
                      <FaEdit className="text-green-500" /> Edit
                    </button>
                    <button
                      className="px-2 py-1 hover:bg-gray-200 flex items-center"
                      onClick={() => {
                        setFacultyToDelete(faculty.id);
                        setShowDeleteModal(true);
                        setActiveMenu(null);
                      }}
                    >
                      <FaTrashAlt className="text-green-500" /> Delete
                    </button>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-700">
                  {faculty.name}
                </h3>
                <p className="text-sm">{faculty.description}</p>
                <p className="text-sm text-gray-700 flex items-end mt-3 capitalize font-bold gap-2">
                  <BuildingLibraryIcon className="text-gray-600 h-6 " />{" "}
                  {faculty.departmentCount} departments
                </p>
              </div>
            ))}
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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Edit Faculty" : "Add Faculty"}
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
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
                    placeholder="Enter faculty name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
                    placeholder="Enter faculty description"
                    rows="4"
                    required
                  />
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this faculty? This action cannot
                be undone.
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-4"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    deleteFaculty(facultyToDelete);
                    setShowDeleteModal(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FacultyManagement;
