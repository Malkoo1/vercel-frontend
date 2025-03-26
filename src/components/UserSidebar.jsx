// components/Sidebar.jsx
import { FolderCode, Search } from "lucide-react";
import { useState } from "react";
import { useFolders } from "../context/FolderContext";
import { IconSidebar } from "./IconSidebar";

export const UserSidebar = ({
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
  } = useFolders();

  const [searchQuery, setSearchQuery] = useState("");

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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
