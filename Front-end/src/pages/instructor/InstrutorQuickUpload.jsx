import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";

const InstructorQuickUpload = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [size, setSize] = useState(null);
  const [lastModified, setLastModified] = useState(null);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, departmentsResponse, documentsResponse] =
          await Promise.all([
            fetch(`http://localhost:8080/api/courses_name/${user.facultyId}`),
            fetch(
              `http://localhost:8080/api/departments_name/${user.facultyId}`
            ),
            fetch(
              `http://localhost:8080/api/documents/get/faculy_documents/${user.facultyId}`
            ),
          ]);
        if (
          !coursesResponse.ok ||
          !departmentsResponse.ok ||
          !documentsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [coursesData, departmentsData, documentsData] = await Promise.all(
          [
            coursesResponse.json(),
            departmentsResponse.json(),
            documentsResponse.json(),
          ]
        );

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

      const fileInput = document.getElementById("file");
      if (fileInput?.files?.length > 0) {
        formData.append("document", fileInput.files[0]);
      } else {
        toast.error("Please select a file to upload.");
        return;
      }

      const url = "http://localhost:8080/api/documents/add";
      const method = "POST";

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
  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      {/* Increased max width */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quick Upload</h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleModalSubmit();
        }}
        className="pr-4"
      >
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Added gap for spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
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
          <label className="block text-sm font-medium mb-2">Description</label>
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
            <label className="block text-sm font-medium mb-2" htmlFor="file">
              File
            </label>
            <input
              type="file"
              required={true}
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
            <label className="block text-sm font-medium mb-2">Faculty</label>
            <input
              type="text"
              value={facultyName}
              disabled
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
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
            <label className="block text-sm font-medium mb-2">Courses</label>
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
            disabled={loading ? true : false}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorQuickUpload;
