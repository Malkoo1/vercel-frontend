import { EyeIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion"; // Import framer-motion
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFolders } from "../context/FolderContext"; // Import FolderContext to potentially refresh files
import {
  deleteFile,
  fetchSharedFileEmails,
  removeSharedAccess,
  shareResource,
  updateFileDescription,
} from "../services/api"; // Assuming you have this API function
import FileUploadPopupVersion from "./FileUploadPopupVersion";

const FileTable = ({ files, onFileDelete }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFileId, setEditingFileId] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleFolderSelect, folderId, showToast, shareDetail } = useFolders(); // Use context to refresh files

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fileId, setFileId] = useState("");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingFileId, setSharingFileId] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [shareEmails, setShareEmails] = useState([""]);

  const openPopup = (file) => {
    setIsPopupOpen(true);
    setFileId(file);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

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

  const handleEditDescription = (file) => {
    setEditingFileId(file._id);
    setNewDescription(file.description || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFileId(null);
    setNewDescription("");
    setIsSubmitting(false);
  };

  const submitDescriptionUpdate = async () => {
    if (!editingFileId) return;
    setIsSubmitting(true);
    try {
      await updateFileDescription(editingFileId, newDescription);
      showToast("File description updated successfully!", "success");
      closeEditModal();
      if (folderId) {
        await handleFolderSelect(folderId); // Refresh file list in the table
      }
    } catch (error) {
      console.error("Error updating file description:", error);
      showToast(`Failed to update description: ${error}`, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openShareModal = async (fileId) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5173";
    setSharingFileId(fileId);
    setShareLink(`${BASE_URL}/viewer/${fileId}`);
    setIsShareModalOpen(true);

    // Fetch the list of already shared users' emails
    const emails = await fetchSharedFileEmails(fileId, "file");

    setShareEmails(emails); // Update state with emails array

    console.log("Emails fetched:", emails); // Log the fetched data

    // Wait for the next render cycle to log updated state
    setTimeout(() => {
      console.log("Updated shareEmails state:", shareEmails);
    }, 100);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSharingFileId(null);
    setShareLink("");
    setShareEmails([""]);
  };

  const handleAddEmail = () => {
    setShareEmails([...shareEmails, ""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...shareEmails];
    newEmails[index] = value;
    setShareEmails(newEmails);
  };

  //   const handleRemoveEmail = (index) => {
  //     const newEmails = shareEmails.filter((_, i) => i !== index);
  //     setShareEmails(newEmails);
  //   };

  const handleRemoveEmail = async (index) => {
    const emailToRemove = shareEmails[index]; // Get email from list

    if (!emailToRemove) {
      const newEmails = shareEmails.filter((_, i) => i !== index);
      setShareEmails(newEmails);
      if (index === shareEmails.length - 1) {
        setShareEmails([""]);
      }
      //   showToast("Invalid email. Please select a valid shared email.", "danger");
      return;
    }

    try {
      await removeSharedAccess({
        resourceType: "file", // Assuming files are shared
        resourceId: sharingFileId,
        email: emailToRemove,
      });

      const newEmails = shareEmails.filter((_, i) => i !== index);
      setShareEmails(newEmails);

      // ✅ Update state after successful removal
      if (index === shareEmails.length - 1) {
        setShareEmails([""]);
      }

      showToast(`Access removed for ${emailToRemove}`, "success");
    } catch (error) {
      console.error("Error removing shared access:", error);
      showToast(`Failed to remove access: ${error.message || error}`, "danger");
    }
  };

  const handleShareSubmit = async () => {
    if (!sharingFileId) return;

    const emailsToShare = shareEmails.filter((email) => email); // Filter out empty emails

    if (emailsToShare.length === 0) {
      showToast("Please enter at least one email to share with.", "warning");
      return;
    }

    try {
      setIsSubmitting(true); // If you want to show a loading state
      const shareData = {
        resourceType: "file", // Assuming you are sharing a file here
        resourceId: sharingFileId,
        shareEmails: emailsToShare,
        // You might want to get permissions from the UI if you implement that
        // permissions: selectedPermissions,
      };

      const responseData = await shareResource(shareData);
      showToast(
        responseData.details || "Resource shared successfully!",
        "success"
      );
      closeShareModal();
    } catch (error) {
      console.error("Error submitting share request:", error);
      showToast(`Failed to share: ${error}`, "danger");
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await deleteFile(fileId); // Call the API function
      showToast(response.message, "success"); // Log success message
      onFileDelete(fileId); // Update the UI by removing the deleted file
    } catch (error) {
      console.error(
        "Failed to delete file:",
        error.response?.data?.message || error.message
      );
      showToast("Failed to delete file. Please try again.", "error"); // Show error message to the user
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

                    {!shareDetail && (
                      <button
                        className="text-gray-400 hover:text-gray-500 ml-2 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDescription(file);
                        }}
                      >
                        {" "}
                        {/* Edit Description Button */}
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    )}
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
                    {!shareDetail && (
                      <button
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(file._id);
                        }}
                      >
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
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </button>
                    )}

                    <Link to={`/viewer/${file._id}`}>
                      <EyeIcon
                        className="h-4 w-4 text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Link>
                    {!shareDetail && (
                      <button
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPopup(file._id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file._id);
                      }}
                      className="text-gray-400 hover:text-gray-500 cursor-pointer"
                    >
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
      <FileUploadPopupVersion
        isOpen={isPopupOpen}
        onClose={closePopup}
        fileData={fileId}
      />
      {/* Edit Description Modal */}
      {isEditModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 bg-modal-200" // Added bg-modal-200 class here
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
            variants={modalVariants}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Description</h2>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-400 mb-4"
              placeholder="Enter new description..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={submitDescriptionUpdate}
                className="px-4 py-2 text-white bg-red-400 hover:bg-red-500 rounded-md disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Share Modal */}
      {isShareModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 bg-modal-200"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
            variants={modalVariants}
          >
            <h2 className="text-lg font-semibold mb-4">Share File</h2>

            {/* Share Link Section */}
            <div className="mb-4">
              <label
                htmlFor="shareLink"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Share Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="shareLink"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-400"
                  value={shareLink}
                  readOnly
                />
                <button
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    showToast("Link copied to clipboard!", "success");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Share with User Section */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Share with User (Email)
              </label>
              {shareEmails.map((email, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-400"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  {shareEmails.length > 0 && (
                    <button
                      className="text-red-500 hover:text-red-700 ml-2 focus:outline-none"
                      onClick={() => handleRemoveEmail(index)}
                    >
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
                  )}
                </div>
              ))}
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAddEmail}
              >
                Add Email
              </button>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeShareModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                className="px-4 py-2 text-white bg-red-400 hover:bg-red-500 rounded-md"
              >
                Share
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FileTable;
