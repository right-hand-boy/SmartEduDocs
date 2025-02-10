import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import PageTitle from "../../utils/PageTitle";
import { FaEdit, FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import Loading from "../../components/common/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BsFillTrashFill } from "react-icons/bs";

function AdminInstructorRoleManagment() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [showAddInstructorModal, setShowAddInstructorModal] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
  });
  const [action, setAction] = useState("");
  const [actionId, setActionId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [selectedDepartmentsIds, setSelectedDepartmentsIds] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, departmentsResponse, instructorsResponse] =
          await Promise.all([
            fetch(`http://localhost:8080/api/courses`),
            fetch(`http://localhost:8080/api/departments`),
            fetch(`http://localhost:8080/api/roles/get/instructors`),
          ]);
        if (
          !coursesResponse.ok ||
          !departmentsResponse.ok ||
          !instructorsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [coursesData, departmentsData, instructorsData] =
          await Promise.all([
            coursesResponse.json(),
            departmentsResponse.json(),
            instructorsResponse.json(),
          ]);

        setInstructors(instructorsData?.data || []);
        setCourses(coursesData?.data?.courses || []);
        setDepartments(departmentsData?.data?.departments || []);
        setFacultyName(departmentsData?.data?.facultyName || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.facultyId]);
  const filteredInstructor = instructors.filter(
    (instructorMember) =>
      instructorMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructorMember.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleAction = (actionType, id) => {
    setAction(actionType);
    setActionId(id);
    setShowConfirmation(true);
  };
  const cancelAction = () => {
    setShowConfirmation(false);
    setAction("");
    setActionId(null);
  };
  const confirmAction = async () => {
    // Demote faculty to student
    const updatedInstructors = instructors.filter(
      (item) => item.id !== actionId
    );
    setLoading(true);
    // Update on the server
    try {
      await fetch(
        `http://localhost:8080/api/roles/demote/instructor/${actionId}`,
        {
          method: "PUT",
        }
      );
    } catch (error) {
      toast.error("Failed to update data on server");
      console.error("Error updating data:", error);
    } finally {
      setInstructors(updatedInstructors);
      setLoading(false);
      toast.success("Faculty Demoted to Student!");
    }

    // Reset state after action
    setShowConfirmation(false);
    setAction("");
    setActionId(null);
  };
  const renderList = (list) => {
    return (
      <ul className="space-y-4">
        {list.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-sm  grid grid-cols-1 md:grid-cols-3 items-center relative"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.email}</p>
            </div>
            <div className="gap-4 mr-4 hidden md:flex">
              {/* {!isStudent && <p>{item.facultyName}</p>} */}
              <ul className={`text-green-600 font-semibold capitalize`}>
                {item.departmentIds.map((deptId) => {
                  return (
                    <li>
                      {
                        departments.find(
                          (department) => department.id === deptId
                        )?.departmentName
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex gap-4 mr-4">
              {/* {!isStudent && <p>{item.facultyName}</p>} */}
              <ul className={`text-green-600 font-semibold capitalize`}>
                {item.courseIds.map((courseId) => {
                  return (
                    <li>
                      {
                        courses.find((course) => course.id === courseId)
                          ?.courseName
                      }
                    </li>
                  );
                })}
              </ul>
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
                    className="fixed inset-0 bg-black opacity-20 z-10 w-screen h-screen"
                  ></div>
                  <div className="absolute z-50 top-8 right-0 bg-white border border-gray-300 rounded-lg p-2 shadow-md space-y-2">
                    <button
                      onClick={() => {
                        setIsEditing(item.id);
                        setShowAddInstructorModal(true);
                        setSelectedCourseIds(item.courseIds);
                        setSelectedDepartmentsIds(item.departmentIds);
                        setNewInstructor({
                          name: item.name,
                          email: item.email,
                        });
                      }}
                      className="flex items-center text-green-600 font-semibold hover:text-green-800"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        handleAction("Demote", item.id);
                      }}
                      className="flex items-center text-red-600 font-semibold hover:text-red-800"
                    >
                      <BsFillTrashFill className="mr-2" /> Demote
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

  const handleSubmit = async () => {
    if (
      !newInstructor.name ||
      !newInstructor.email ||
      !selectedCourseIds.length ||
      !selectedCourseIds.length
    ) {
      toast.error("all fields are required");
      return;
    } else if (!newInstructor.email.includes("@")) {
      toast.error("insert valid emial address");
      return;
    }
    const courseValidityArray = selectedCourseIds.map((courseId) => {
      const course = courses.find((course) => course.id === courseId);
      return course
        ? selectedDepartmentsIds.includes(course.departmentId)
        : false;
    });
    if (courseValidityArray.includes(false)) {
      toast.error("invalid course department combination");
      return;
    }
    const instructorData = {
      name: newInstructor.name,
      role: "instructor",
      email: newInstructor.email,
      departmentIds: selectedDepartmentsIds,
      courseIds: selectedCourseIds,
    };
    setSaving(true);
    // Add the new faculty to the server
    const link = isEditing
      ? "http://localhost:8080/api/roles/edit/instructor"
      : "http://localhost:8080/api/roles/add/instructor";
    const method = isEditing ? "PATCH" : "POST";
    try {
      const response = await fetch(link, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing && { id: isEditing }),
          name: newInstructor.name,
          ...(!isEditing && { role: "faculty" }),
          email: newInstructor.email,
          departmentIds: selectedDepartmentsIds,
          courseIds: selectedCourseIds,
          facultyId: user.facultyId,
        }),
      }).then((res) => res.json());
      if (!response.success) {
        toast.error(response.data.message);
      }
      if (isEditing) {
        const ins = instructors.filter((inst) => inst.id != isEditing);
        setInstructors([...ins, instructorData]);
        toast.success("Faculty information updated successfuly!");
      } else {
        setInstructors([...instructors, instructorData]);
        toast.success("Faculty Added!");
      }
    } catch (error) {
      toast.error("Failed to add faculty");
      console.error("Error adding faculty:", error);
    } finally {
      // Add the new faculty to the state
      setShowAddInstructorModal(false);
      setNewInstructor({ name: "", email: "" });
      setSaving(false);
      setSelectedCourseIds([]);
      setSelectedDepartmentsIds([]);
      setActionId(null);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <PageTitle title={"Role Management - SmartEduDocs"} />
      <div className="w-full md:flex flex-col">
        {/* Add Faculty Button */}
        <div className="sticky bg-gray-100 top-0 rounded-md z-10 pb-2">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-4 justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              All Instructors
            </h2>
            <div className="relative w-full md:w-auto">
              <FaSearch className="w-5 h-5 absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instructor"
                className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none  transition"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto h-56 scrollbar-thin md:pr-4 pr-22 ">
          {filteredInstructor.length != 0 ? (
            renderList(filteredInstructor, false)
          ) : (
            <div className="flex justify-center">
              <p>there is no instructor</p>
            </div>
          )}
        </div>
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center z-20 justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                Are you sure?
              </h2>
              <p className="mb-6 mt-2 text-gray-600">
                You are about to {action === "ban" ? "ban" : "demote"} this{" "}
                {action === "ban" ? "student" : "faculty member"}.
              </p>
              <div className="flex justify-between">
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
        {showAddInstructorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:max-w-fit">
              <div className="mb-4 flex justify-between text-brightGreen">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? "Edit" : "Add New"} Instructor
                </h2>
                <MdClose
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setShowAddInstructorModal(false)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-h-[60vh] md:h-auto overflow-y-auto no-scrollbar">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="p-2 rounded-md w-full focus:outline-none"
                    placeholder="Instructor Name"
                    value={newInstructor.name}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        name: e.target.value.toLocaleLowerCase(),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="p-2 rounded-md w-full focus:outline-none"
                    placeholder="Instructor Email"
                    value={newInstructor.email}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        email: e.target.value.toLocaleLowerCase(),
                      })
                    }
                  />
                </div>
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
                  <div className="space-y-2 ma:h-36 bg-gray-200 p-2 overflow-y-auto no-scrollbar">
                    {departments.map((department) => (
                      <div key={department.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`department-${department.id}`}
                          value={department.id}
                          checked={selectedDepartmentsIds.includes(
                            department.id
                          )}
                          onChange={(e) => {
                            const newSelected = [...selectedDepartmentsIds];
                            if (e.target.checked) {
                              newSelected.push(department.id);
                            } else {
                              const index = newSelected.indexOf(department.id);
                              if (index > -1) newSelected.splice(index, 1);
                            }
                            setSelectedDepartmentsIds(newSelected);
                          }}
                          className="mr-2 accent-brightGreen"
                        />
                        <label
                          htmlFor={`department-${department.id}`}
                          className="text-sm"
                        >
                          {department.departmentName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Courses
                  </label>
                  <div className="space-y-2 max-h-36 bg-gray-200 p-2 overflow-y-auto no-scrollbar">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`course-${course.id}`}
                          value={course.id}
                          checked={selectedCourseIds.includes(course.id)}
                          onChange={(e) => {
                            const newSelected = [...selectedCourseIds];
                            if (e.target.checked) {
                              newSelected.push(course.id);
                            } else {
                              const index = newSelected.indexOf(course.id);
                              if (index > -1) newSelected.splice(index, 1);
                            }
                            setSelectedCourseIds(newSelected);
                          }}
                          className="mr-2 accent-brightGreen"
                        />
                        <label
                          htmlFor={`course-${course.id}`}
                          className="text-sm"
                        >
                          {course.courseName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end md:col-span-2 items-center gap-4">
                  <button
                    onClick={() => {
                      setShowAddInstructorModal(false);
                      setSaving(false);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2 capitalize">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="h-6 w-6 text-brightGreen"
                        />
                        adding
                      </span>
                    ) : isEditing ? (
                      "Update"
                    ) : (
                      "Add Instructor"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminInstructorRoleManagment;
