import React, { useState } from "react";

const FileTable = ({ files }) => {
  const [expandedRows, setExpandedRows] = useState({});

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
    <div className="flex-1 overflow-auto bg-table-500 rounded-2xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="w-10 px-6 py-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
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
                    className="h-4 w-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={() => toggleRowExpansion(file.id)}
                >
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {file.name}
                      </div>
                    </div>
                    {file.versions && file.versions.length > 0 && (
                      <svg
                        className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
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
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">
                    {file.description}
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
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Nested table for versions */}
              {expandedRows[file.id] &&
                file.versions &&
                file.versions.length > 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-0 py-0 border-b border-gray-200"
                    >
                      <div className="bg-gray-100 p-4">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                          <tbody className="bg-white divide-y divide-gray-200">
                            {file.versions.map((version) => (
                              <tr key={version.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getFileIcon(file.type)}
                                    <div className="ml-3 text-sm font-medium text-gray-900">
                                      {version.name}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(version.date)}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {version.size}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex space-x-2 justify-end">
                                    <button className="text-gray-400 hover:text-gray-500">
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                      </svg>
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-500">
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

export default FileTable;
