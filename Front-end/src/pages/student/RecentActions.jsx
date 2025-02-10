import React from "react";

function RecentActions() {
  const actions = [
    {
      id: 1,
      description: "Downloaded lecture notes for Physics 101",
      date: "2025-01-12",
    },
    {
      id: 2,
      description: "Viewed assignment for Calculus II",
      date: "2025-01-11",
    },
    {
      id: 3,
      description: "Submitted feedback for Chemistry Lab",
      date: "2025-01-10",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Actions
      </h2>
      <ul className="space-y-4">
        {actions.map((action) => (
          <li key={action.id} className="flex justify-between items-center">
            <div className="text-gray-700">{action.description}</div>
            <div className="text-sm text-gray-500">
              {new Date(action.date).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActions;
