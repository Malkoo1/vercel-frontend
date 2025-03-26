import React, { useEffect, useRef, useState } from "react";
import { useFolders } from "../context/FolderContext"; // Import useFolders
// import { uploadMultipleFiles } from '../services/api'; // Original import - likely for initial file upload, not versioning
import { uploadFileVersions } from "../services/api"; // Import the new uploadFileVersions API function (adjust path as needed)

const FileUploadPopupVersion = ({ isOpen, onClose, fileData }) => {
  // Receive isOpen, onClose, and fileData as props
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { folderId, handleFolderSelect, showToast } = useFolders(); // Use FolderContext - keep selectedFolder if still needed for context
  const [uploading, setUploading] = useState(false); // State to indicate uploading status
  const [fileId, setFileId] = useState("");
  useEffect(() => {
    console.log(fileData);
    setFileId(fileData);
  }, [fileData]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFileInputChange = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newFiles = files.map((file, index) => {
      // Determine file type icon
      let icon = "document";
      const extension = file.name.split(".").pop().toLowerCase();

      if (["doc", "docx"].includes(extension)) icon = "word";
      else if (["ppt", "pptx"].includes(extension)) icon = "powerpoint";
      else if (["xls", "xlsx"].includes(extension)) icon = "excel";
      else if (extension === "pdf") icon = "pdf";

      return {
        id: Date.now() + index,
        fileObject: file, // Store the actual File object here
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: extension,
        icon,
        status: "Pending Upload", // Initial status
      };
    });

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const getFileIcon = (iconType) => {
    switch (iconType) {
      case "word":
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path
                d="M14 3v5h5M8 17l2-7h1l2 7M8 13h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        );
      case "powerpoint":
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path
                d="M14 3v5h5M12 14v4M8 12h4a2 2 0 100-4H8v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        );
      case "pdf":
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path
                d="M14 3v5h5M9 14v-4h3a2 2 0 110 4h-3m0 0v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
    }
  };

  const handleContinueUpload = async () => {
    if (!fileId) {
      showToast("File ID is missing. Cannot upload versions.", "warning");
      return;
    }

    if (uploadedFiles.length === 0) {
      showToast("Please select files to upload versions.", "warning");
      return;
    }

    setUploading(true); // Start uploading state

    try {
      const response = await uploadFileVersions(
        fileId, // Pass fileId from fileData prop
        uploadedFiles.map((fileInfo) => fileInfo.fileObject) // Extract File objects
      ); // Call the version upload API function

      showToast("File versions uploaded successfully!", "success");

      console.log("File versions uploaded successfully:", response);
      handleFolderSelect(folderId); // Removed as folder context might not be relevant for version upload
      setUploadedFiles([]); // Clear uploaded files on success
      onClose(); // Close the popup
      // Optionally, you might want to refresh the file details in the parent component here if needed
    } catch (error) {
      console.error("Error uploading file versions:", error);
      showToast("Failed to upload file versions. Please try again.", "danger");
    } finally {
      setUploading(false); // End uploading state
    }
  };

  return (
    <div className="relative font-sans">
      {/* Popup Overlay */}
      {isOpen && ( // Use isOpen prop to control popup visibility
        <div className="fixed inset-0 bg-modal-200 bg-opacity-30 flex items-center justify-center z-50">
          {/* Popup Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Upload New Versions
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Drag and drop or select files to add new versions to the file:{" "}
                {fileData?.name}
              </p>{" "}
              {/* Display file name from props */}
            </div>

            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center bg-gray-50
                                ${
                                  isDragging
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-300"
                                }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex flex-col items-center justify-center cursor-pointer">
                <div className="mb-4 bg-gray-200 p-4 rounded-full relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-700 mb-1">
                  Drag and drop here to add new versions
                </h3>
                <p className="text-sm text-gray-500">
                  File type must be (PowerPoint, PDF, Word Doc, etc)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Files to Upload as New Versions
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 h-[100px] overflow-auto">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.icon)}
                        <div>
                          <p className="font-medium text-gray-800">
                            {file.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{file.size}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span
                              className={
                                file.status === "Completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                            >
                              {file.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleContinueUpload} // Call upload function on Continue
                className={`flex-1 bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg transition-colors duration-300 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={uploading} // Disable button during upload
              >
                {uploading ? "Uploading..." : "Continue"}
              </button>
              <button
                onClick={onClose} // Use onClose prop to close
                className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-3 px-4 border border-gray-300 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPopupVersion;
