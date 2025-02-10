import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaUserTie } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Loading from "../../components/common/Loading";
import { BsFillTrashFill } from "react-icons/bs"; // Trash icon
import { toast } from "react-toastify";
import { TbFaceIdError } from "react-icons/tb";
import PageTitle from "../../utils/PageTitle";
import AdminInstructorRoleManagment from "./AdminInstructorRoleManagment";

function RoleManagement() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchStudentQuery, setStudentSearchQuery] = useState("");
  const [searchFacultyQuery, setFacultySearchQuery] = useState("");
  const [action, setAction] = useState("");
  const [actionId, setActionId] = useState(null);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
  });

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const [
          studentsResponse,
          facultyResponse,
          facultiesResponse,
          // instructorsResponse,
        ] = await Promise.all([
          fetch("http://localhost:8080/api/roles/students"),
          fetch("http://localhost:8080/api/roles/faculties"),
          fetch("http://localhost:8080/api/faculties"),
          // fetch("http://localhost:8080/api/roles/instructors"),
        ]);
        const studentsData = await studentsResponse.json();
        const facultyData = await facultyResponse.json();
        const facultiesData = await facultiesResponse.json();
        setStudents(studentsData.data);
        setFaculty(facultyData.data);
        setFaculties(facultiesData.data);

        // Fetch faculty
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = (actionType, id) => {
    setAction(actionType);
    setActionId(id);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    if (action === "demote" && actionId !== null) {
      // Demote faculty to student
      const updatedFaculty = faculty.filter((item) => item.id !== actionId);
      const demotedFaculty = faculty.find((item) => item.id === actionId);
      if (demotedFaculty) {
        setStudents([
          ...students,
          { ...demotedFaculty, role: "student", id: students.length + 1 },
        ]);
      }
      setLoading(true);
      // Update on the server
      try {
        await fetch(
          `http://localhost:8080/api/roles/demote/faculty/${actionId}`,
          {
            method: "PUT",
          }
        );
      } catch (error) {
        toast.error("Failed to update data on server");
        console.error("Error updating data:", error);
      } finally {
        setFaculty(updatedFaculty);
        setLoading(false);
        toast.success("Faculty Demoted to Student!");
      }
    } else if (action === "ban" && actionId !== null) {
      // Ban student
      const updatedStudents = students.filter((item) => item.id !== actionId);
      setLoading(true);
      // Update on the server
      try {
        await fetch(`http://localhost:8080/api/roles/ban/${actionId}`, {
          method: "DELETE",
        });
      } catch (error) {
        toast.error("Failed to update data on server");
        console.error("Error updating data:", error);
      } finally {
        setLoading(false);
        setStudents(updatedStudents);
        toast.success("Student Banned!");
      }
    }

    // Reset state after action
    setShowConfirmation(false);
    setAction("");
    setActionId(null);
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setAction("");
    setActionId(null);
  };

  const handleAddFaculty = async () => {
    const newFacultyObj = {
      name: newFaculty.name,
      role: "faculty",
      email: newFaculty.email,
      facultyName:
        faculties.find((faculty) => faculty.id === facultyId)?.name ||
        "Unknown",
    };
    setLoading(true);
    // Add the new faculty to the server
    try {
      const link = isEditing
        ? `http://localhost:8080/api/roles/edit/faculty/${facultyId}`
        : "http://localhost:8080/api/roles/add/faculty";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(link, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFaculty.name,
          email: newFaculty.email,
          ...(!isEditing && { role: "faculty", facultyId }),
          ...(isEditing && { id: isEditing }),
        }),
      }).then((res) => res.json());
      if (response.ok || response.success) {
        setFaculty([...faculty, newFacultyObj]);
        toast.success("Faculty Added!");
      }
    } catch (error) {
      toast.error("Failed to add faculty");
      console.error("Error adding faculty:", error);
    } finally {
      restForms();
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchStudentQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (facultyMember) =>
      facultyMember.name
        .toLowerCase()
        .includes(searchFacultyQuery.toLowerCase()) ||
      facultyMember.email
        .toLowerCase()
        .includes(searchFacultyQuery.toLowerCase()) ||
      facultyMember.facultyName
        .toLocaleLowerCase()
        .includes(searchFacultyQuery.toLowerCase())
  );
  // const filteredInstructors = instructors.filter(
  //   (instructor) =>
  //     instructor.name
  //       .toLowerCase()
  //       .includes(searchFacultyQuery.toLowerCase()) ||
  //     instructor.email
  //       .toLowerCase()
  //       .includes(searchFacultyQuery.toLowerCase())
  // );
  function restForms() {
    setShowAddFacultyModal(false);
    setNewFaculty({ name: "", email: "" });
    setFacultyId(null);
    setIsEditing(false);
    setLoading(false);
  }

  const renderList = (list, role) => {
    return (
      <ul className="space-y-4">
        {list.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 w-full justify-between items-center relative"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.email}</p>
            </div>
            <div className="flex gap-4 mr-4 w-fit">
              {role == "faculty" && <p>{item.facultyName}</p>}
            </div>
            <div className="absolute top-2 right-2">
              <HiDotsVertical
                onClick={() => setActionId(item.id)}
                className="cursor-pointer relative text-gray-600 hover:text-gray-900"
              />
              {actionId === item.id && (
                <>
                  <div
                    onClick={() => setActionId(null)}
                    className="fixed inset-0 bg-black opacity-10 z-10 w-full h-full"
                  ></div>
                  <div className="absolute z-30 top-6 right-0 space-y-2">
                    <button
                      button
                      onClick={() => {
                        if (role == "faculty") {
                          setIsEditing(item.id);
                          setShowAddFacultyModal(true);
                          setNewFaculty({
                            name: item.name,
                            email: item.email,
                          });
                        } else if (role == "student") {
                          handleAction("Promote", item.id);
                        }
                      }}
                      className="flex mb-2 items-center bg-white w-full p-2 rounded-lg shadow-md  text-brightGreen font-semibold hover:text-green-600s"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        if (role == "faculty" || role == "instructor") {
                          handleAction("Demote", item.id);
                        } else if (role == "student") {
                          handleAction("Ban", item.id);
                        }
                      }}
                      className="flex items-center w-full bg-white p-2 rounded-lg shadow-md  text-red-600 font-semibold hover:text-red-800"
                    >
                      <BsFillTrashFill className="mr-2" />{" "}
                      {role == "student" ? "Ban" : "Demote"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <PageTitle title={"Role Management - SmartEduDocs"} />
      <div className="w-full">
        {/* Add Faculty Button */}
        <div className="mb-4 flex flex-wrap justify-between items-center md:items-center gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
            Role Management
          </h1>
          <button
            onClick={() => setShowAddFacultyModal(true)}
            className="bg-green-600 text-white px-5 py-2 md:px-6 md:py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Add Faculty Head
          </button>
        </div>

        {/* View All Faculty */}
        <div className="mb-4 rounded-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              All Faculty
            </h2>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchFacultyQuery}
                onChange={(e) => setFacultySearchQuery(e.target.value)}
                placeholder="Search faculty or staff..."
                className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="h-48 overflow-y-auto pr-6 scrollbar-thin">
            {filteredFaculty.length != 0 ? (
              renderList(filteredFaculty, "faculty")
            ) : (
              <div className="flex justify-center">
                <p>there is no faculty</p>
              </div>
            )}
          </div>
        </div>

        {/* View All Students */}
        <div className="mb-4 rounded-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              All Students
            </h2>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchStudentQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="h-48 overflow-y-auto pr-6 scrollbar-thin">
            {filteredStudents.length != 0 ? (
              renderList(filteredStudents, "student")
            ) : (
              <div className="flex justify-center">
                <p>there is no students</p>
              </div>
            )}
          </div>
        </div>
        <AdminInstructorRoleManagment />

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center z-20 justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                Are you sure?
              </h2>
              <p className="mt-2 text-gray-600">
                You are about to {action === "ban" ? "ban" : "demote"} this{" "}
                {action === "ban" ? "student" : "faculty member"}.
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={cancelAction}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Faculty Modal */}
        {showAddFacultyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? "Edit Faculty" : "Add New Faculty"}
              </h2>
              <input
                type="text"
                className="mt-4 p-2 bg-gray-300 rounded-md w-full focus:outline-none"
                placeholder="Name"
                value={newFaculty.name}
                onChange={(e) =>
                  setNewFaculty({
                    ...newFaculty,
                    name: e.target.value.toLocaleLowerCase(),
                  })
                }
              />
              <input
                type="email"
                className="mt-4 p-2 bg-gray-300 rounded-md w-full focus:outline-none"
                placeholder="Email"
                value={newFaculty.email}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, email: e.target.value })
                }
              />
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="border p-2 rounded w-full mt-4 bg-gray-300 focus:outline-none"
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowAddFacultyModal(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>{" "}
                <button
                  onClick={handleAddFaculty}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RoleManagement;
