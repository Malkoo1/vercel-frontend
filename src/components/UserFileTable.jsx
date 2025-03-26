import { EyeIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFolders } from "../context/FolderContext"; // Import FolderContext to potentially refresh files

const UserFileTable = ({ files, onFileDelete }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const { shareDetail } = useFolders(); // Use context to refresh files

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "jpg":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-teal-600 rounded-sm text-white text-xs">
            JPG
          </div>
        );
      case "png":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-teal-600 rounded-sm text-white text-xs">
            PNG
          </div>
        );
      case "docx":
      case "doc":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-sm text-white text-xs">
            W
          </div>
        );
      case "xlsx":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-sm text-white text-xs">
            X
          </div>
        );
      case "pptx":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-sm text-white text-xs">
            P
          </div>
        );
      case "psd":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-blue-900 rounded-sm text-white text-xs">
            Ps
          </div>
        );
      case "ai":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-orange-900 rounded-sm text-white text-xs">
            Ai
          </div>
        );
      case "pdf":
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-sm text-white text-xs">
            PDF
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center w-6 h-6 bg-gray-600 rounded-sm text-white text-xs">
            F
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Or handle the missing date as needed
    }

    try {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Or a default error message
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-table-500 rounded-2xl relative">
      {" "}
      {/* Make relative for absolute positioning */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="w-10 px-6 py-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-500  rounded"
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              File Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date Upload
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              File Size
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200">
          {files.map((file) => (
            <React.Fragment key={file.id}>
              <tr
                className={`hover:bg-gray-50 cursor-pointer ${
                  expandedRows[file.id] ? "bg-gray-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-red-400 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={() => toggleRowExpansion(file.id)}
                >
                  <div className="flex items-center relative">
                    {file.versions && file.versions.length > 0 && (
                      <svg
                        className={`mr-2 h-4 w-4 absolute top-[4px] -left-[25px] text-gray-400 transition-transform ${
                          expandedRows[file.id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {getFileIcon(file.type)}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 w-[100px] overflow-hidden text-ellipsis">
                        {file.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm flex text-gray-400">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[12ch]">
                      {file.description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(file.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div
                    className="flex space-x-2 justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/viewer/${file._id}`}>
                      <EyeIcon
                        className="h-4 w-4 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </td>
              </tr>

              {/* Nested table for versions */}
              {expandedRows[file.id] &&
                file.versions &&
                file.versions.length > 0 && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 hidden text-red-400 rounded"
                      />
                    </td>
                    <td
                      colSpan={6}
                      className="px-0 py-0 border-b border-gray-200"
                    >
                      <div className="bg-gray-100 p-4 space-y-4">
                        {/* Group versions by version.id */}
                        {Array.from(
                          new Set(file.versions.map((v) => v.id))
                        ).map((versionId) => {
                          const versionFiles = file.versions.filter(
                            (v) => v.id === versionId
                          );
                          return (
                            <div key={versionId} className="space-y-2">
                              <h3 className="text-sm font-medium text-gray-700">
                                Version {versionId}
                              </h3>
                              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {versionFiles.map((version) => (
                                    <tr
                                      key={version._id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          {getFileIcon(
                                            version.name.split(".").pop()
                                          )}
                                          <div className="ml-3 text-sm font-medium text-gray-900 w-[250px] overflow-hidden text-ellipsis">
                                            {version.name}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(version.date)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {version.size}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2 justify-end">
                                          {/* Action buttons can be added here */}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFileTable;
