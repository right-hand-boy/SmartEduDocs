import React from "react";

const SearchAndFilters = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <form className="flex gap-4 items-center">
        <h2 className="text-lg font-bold">Search Documents</h2>
        <input
          type="text"
          placeholder="Search by keyword"
          className="block flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-brightGreen text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchAndFilters;
