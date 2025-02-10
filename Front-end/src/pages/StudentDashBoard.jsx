import React from "react";
import SearchAndFilters from "./student/SearchAndFilters";
import CourseOverview from "./student/CourseOverview";
import RecentActions from "./student/RecentActions";

function StudentDashBoard() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search and Filters Section */}
        <SearchAndFilters />
        <div className="flex flex-wrap gap-4">
          {/* Course Overview Section */}
          <CourseOverview />

          {/* Recent Actions Section */}
          <RecentActions />
        </div>
      </div>
    </div>
  );
}

export default StudentDashBoard;
