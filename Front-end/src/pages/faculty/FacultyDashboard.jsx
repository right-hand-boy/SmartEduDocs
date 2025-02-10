import React from "react";
import QuickUpload from "./QuickUpload";
import UploadSummary from "./UploadSummary";
import PageTitle from "../../utils/PageTitle";

function FacultyDashboard() {
  return (
    <div className="w-full">
      <PageTitle title={"Faculty Dashboard - SmartEduDocs"} />
      <div className="w-full space-y-6">
        <QuickUpload />
        <UploadSummary />
      </div>
    </div>
  );
}

export default FacultyDashboard;
