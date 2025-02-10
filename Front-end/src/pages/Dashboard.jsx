import React from "react";

import { useAuth } from "../context/Authcontext";
import PageTitle from "../utils/PageTitle";

function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <PageTitle title={"Dashboard - SmartEduDocs"} />
      <div className="">
        <div className="flex items-center justify-between md:px-16 py-6">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 bg-brightGreen rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-gray-950 capitalize">{user.name}</p>
              <p className="text-sm text-gray-700">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-600">Role: </p>
            <p className="text-brightGreen pb-1 border-b-2 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
