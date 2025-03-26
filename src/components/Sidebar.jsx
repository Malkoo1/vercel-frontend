// components/Sidebar.jsx
import { motion } from "framer-motion";
import { FolderCode, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useFolders } from "../context/FolderContext";
import {
  fetchSharedFileEmails,
  removeSharedAccess,
  shareResource,
} from "../services/api";
import CreateNewFolder from "./CreateNewFolder";
import { IconSidebar } from "./IconSidebar";

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const {
    folders = [],
    shareFolder = [],
    handleFolderSelect,
    handleShareFolderSelect,
    showToast,
  } = useFolders();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [folderToUpdate, setFolderToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingFileId, setSharingFileId] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [shareEmails, setShareEmails] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const openShareModal = (fileId) => {

  //     const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
  //     setSharingFileId(fileId);
  //     // In a real application, you would likely fetch or generate a share link here
  //     setShareLink(`${BASE_URL}/viewer/${fileId}`);
  //     setIsShareModalOpen(true);
  // };

  const openShareModal = async (fileId) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5173";
    setSharingFileId(fileId);
    setShareLink(`${BASE_URL}/viewer/${fileId}`);
    setIsShareModalOpen(true);

    // Fetch the list of already shared users' emails
    const emails = await fetchSharedFileEmails(fileId, "folder");

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
        resourceType: "folder", // Assuming files are shared
        resourceId: sharingFileId,
        email: emailToRemove,
      });

      // ✅ Update state after successful removal
      const newEmails = shareEmails.filter((_, i) => i !== index);
      setShareEmails(newEmails);
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
        resourceType: "folder", // Assuming you are sharing a file here
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

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setFolderToUpdate(null);
  };

  const openUpdateFolderModal = (folder) => {
    setFolderToUpdate(folder);
    setIsPopupOpen(true);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShareFolders = shareFolder.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Icon Sidebar */}
      <IconSidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Folders Sidebar */}

      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } relative h-screen lg:block w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto`}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a Folder"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm text-gray-700"
                value={searchQuery} // Bind the input value to the state
                onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">
                  Folders List
                </h2>
              </div>

              <div
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 184px)" }}
              >
                {" "}
                {/* Added overflow-y-auto and max-h-[300px] */}
                {filteredFolders.map((folder) => (
                  <div
                    key={folder._id}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer ${
                      folder.active ? "bg-coral-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex items-center flex-1"
                      onClick={() => handleFolderSelect(folder._id)}
                    >
                      <div
                        className={`w-5 h-5 mr-3 ${
                          folder.active ? "text-coral-500" : "text-gray-400"
                        }`}
                      >
                        <FolderCode size={20} />
                      </div>
                      <span
                        className={
                          folder.active
                            ? "text-coral-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {folder.name}
                      </span>
                    </div>

                    <button
                      className="text-gray-400 mr-2 hover:text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareModal(folder._id);
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openUpdateFolderModal(folder);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ))}
                {/* share folder Show */}
                {filteredShareFolders.map((folder) => (
                  <div
                    key={folder._id}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer ${
                      folder.active ? "bg-coral-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex items-center flex-1"
                      onClick={() => handleShareFolderSelect(folder._id)}
                    >
                      <div
                        className={`w-5 h-5 mr-3 ${
                          folder.active ? "text-coral-500" : "text-gray-400"
                        }`}
                      >
                        <FolderCode size={20} />
                      </div>
                      <span
                        className={
                          folder.active
                            ? "text-coral-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {folder.name}
                      </span>
                    </div>

                    {/* <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openUpdateFolderModal(folder);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Pencil size={16} />
                            </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={openPopup}
            className="w-full flex items-center justify-center px-4 py-3 rounded-[18px] border border-gray-300 shadow-very-subtle text-sm text-gray-600 hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Folder
          </button>
        </div>
      </div>

      {/* <CreateNewFolder
                isOpen={isPopupOpen}
                onClose={closePopup}
                onFolderCreated={handleFolderCreated}
                folder={folderToUpdate}
            /> */}

      <CreateNewFolder
        isOpen={isPopupOpen}
        onClose={closePopup}
        folder={folderToUpdate}
      />

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
            <h2 className="text-lg font-semibold mb-4">Share Folder</h2>

            {/* Share Link Section */}

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
                    // disabled={email.trim().length > 0}
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
    </>
  );
};
