import React from "react";
import ActivitySummary from "./admin/ActivitySummary";
import QuickLinks from "./admin/QuickLinks";
import SystemOverview from "./admin/SystemOverview";
import PageTitle from "../utils/PageTitle";

function AdminDashboard() {
  return (
    <div>
      <PageTitle title={"Admin Dashboard - SmartEduDocs"} />
      <SystemOverview />
      <ActivitySummary />
    </div>
  );
}

export default AdminDashboard;
