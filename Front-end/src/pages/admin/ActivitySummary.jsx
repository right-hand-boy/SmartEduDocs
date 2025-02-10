import React from "react";

const ActivitySummary = () => {
  const activities = [
    {
      id: 1,
      type: "Upload",
      description: "Lecture notes uploaded for Math 101",
      date: "2025-01-10",
    },
    {
      id: 2,
      type: "Registration",
      description: "New user registered: John Doe",
      date: "2025-01-09",
    },
    {
      id: 3,
      type: "Upload",
      description: "Lecture notes uploaded for Math 101",
      date: "2025-01-10",
    },
    {
      id: 4,
      type: "Registration",
      description: "New user registered: John Doe",
      date: "2025-01-09",
    },
    {
      id: 5,
      type: "Upload",
      description: "Lecture notes uploaded for Math 101",
      date: "2025-01-10",
    },
    {
      id: 6,
      type: "Registration",
      description: "New user registered: John Doe",
      date: "2025-01-09",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl text-green-600 font-bold mb-4">
        Activity Summary
      </h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 text-gray-600">Type</th>
            <th className="text-left py-2 px-4 text-gray-600">Description</th>
            <th className="text-left py-2 px-4 text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-t">
              <td
                className={`"py-2 px-4 font-bold ${
                  activity.type.toLocaleLowerCase() == "upload"
                    ? "text-green-500"
                    : activity.type.toLocaleLowerCase() == "registration"
                    ? "text-blue-500"
                    : ""
                }`}
              >
                {activity.type}
              </td>
              <td className="py-2 px-4">{activity.description}</td>
              <td className="py-2 px-4">{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivitySummary;
