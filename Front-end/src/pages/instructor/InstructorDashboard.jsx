import React from "react";
import QuickUpload from "../faculty/QuickUpload";
import UploadSummary from "../faculty/UploadSummary";
import PageTitle from "../../utils/PageTitle";

function InstructorDashboard() {
  return (
    <div className="bg-gray-100">
      <PageTitle title={"Faculty Dashboard - SmartEduDocs"} />
      <div className="w-full space-y-6">
        <QuickUpload />
        <UploadSummary />
      </div>
    </div>
  );
}

export default InstructorDashboard;
