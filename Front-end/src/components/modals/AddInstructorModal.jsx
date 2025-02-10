import { useState } from "react";
import { MdClose } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const AddInstructorModal = ({
  showAddInstructorModal,
  setShowAddInstructorModal,
  newInstructor,
  setNewInstructor,
  facultyName,
  departments,
  courses,
  selectedDepartmentIds,
  setSelectedDepartmentsIds,
  selectedCourseIds,
  setSelectedCourseIds,
  saving,
  handleAddInstructor,
}) => {
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const toggleSelection = (id, selectedIds, setSelectedIds) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id]
    );
  };

  return (
    showAddInstructorModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:max-w-fit">
          <div className="mb-4 flex justify-between text-brightGreen">
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Instructor
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
                className="p-2 rounded-md w-full focus:outline-none border"
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
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="p-2 rounded-md w-full focus:outline-none border"
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
              <label className="block text-sm font-medium mb-2">Faculty</label>
              <input
                type="text"
                value={facultyName}
                disabled
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                required
              />
            </div>

            {/* Department Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <div
                className="w-full px-4 py-2 border rounded-md focus:outline-none cursor-pointer bg-white"
                onClick={() =>
                  setShowDepartmentDropdown(!showDepartmentDropdown)
                }
              >
                {selectedDepartmentIds.length > 0
                  ? departments
                      .filter((dept) => selectedDepartmentIds.includes(dept.id))
                      .map((dept) => dept.departmentName)
                      .join(", ")
                  : "Select Department"}
              </div>

              {showDepartmentDropdown && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {departments.map((department) => (
                    <label
                      key={department.id}
                      className="block px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartmentIds.includes(department.id)}
                        onChange={() =>
                          toggleSelection(
                            department.id,
                            selectedDepartmentIds,
                            setSelectedDepartmentsIds
                          )
                        }
                      />
                      {department.departmentName}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Courses Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Courses</label>
              <div
                className="w-full px-4 py-2 border rounded-md focus:outline-none cursor-pointer bg-white"
                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
              >
                {selectedCourseIds.length > 0
                  ? courses
                      .filter((course) => selectedCourseIds.includes(course.id))
                      .map((course) => course.courseName)
                      .join(", ")
                  : "Select Courses"}
              </div>

              {showCourseDropdown && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className="block px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourseIds.includes(course.id)}
                        onChange={() =>
                          toggleSelection(
                            course.id,
                            selectedCourseIds,
                            setSelectedCourseIds
                          )
                        }
                      />
                      {course.courseName}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end md:col-span-2 items-center gap-4">
              <button
                onClick={() => {
                  setShowAddInstructorModal(false);
                }}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddInstructor()}
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                ) : (
                  "Add Instructor"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddInstructorModal;
