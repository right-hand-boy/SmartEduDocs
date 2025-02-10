import React, { useEffect, useState } from "react";
import Loading from "../../components/common/Loading";

const SystemOverview = () => {
  const [systemData, setSystemData] = useState({
    totalUsers: 0,
    totalFaculties: 0,
    totalStudents: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalUploadedDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/system-overview",
          { method: "GET" }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setSystemData(data.data);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-white flex-1 shadow-md rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4">System Overview</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white flex-1 shadow-md rounded-lg p-6"
      aria-label="System Overview"
    >
      <h2 className="text-xl font-bold mb-4">System Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-600">
            {systemData.totalUsers}
          </h3>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-600">
            {systemData.totalFaculties}
          </h3>
          <p className="text-gray-600">Faculties</p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-red-600">
            {systemData.totalDepartments}
          </h3>
          <p className="text-gray-600">Departments</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-pink-600">
            {systemData.totalCourses}
          </h3>
          <p className="text-gray-600">Courses</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-600">
            {systemData.totalUploadedDocuments}
          </h3>
          <p className="text-gray-600">Uploaded Documents</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-600">
            {systemData.totalFacultyHead}
          </h3>
          <p className="text-gray-600">Faculty admin</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-rose-600">
            {systemData.totalInstrucors}
          </h3>
          <p className="text-gray-600">Instructors</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-600">
            {systemData.totalStudents}
          </h3>
          <p className="text-gray-600">Students</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
