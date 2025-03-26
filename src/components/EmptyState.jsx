import React from "react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white">
      <div className="text-center">
        <h3 className="font-medium text-gray-700">No files found.</h3>
        <p className="text-sm text-gray-500">Please upload some files.</p>
      </div>
    </div>
  );
};

export default EmptyState;
