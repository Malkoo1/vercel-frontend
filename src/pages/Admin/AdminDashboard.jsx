import { useState } from "react";
import EmptyState from "../../components/EmptyState"; // Import the EmptyState component
import FileTable from "../../components/FileTable";
import CustomToast from "../../components/Toast";
import UserFileTable from "../../components/UserFileTable";
import { useFolders } from "../../context/FolderContext";

const AdminDashboard = () => {
  const { files = [], isLoading, setFiles, userRole } = useFolders();
  const [showToast, setShowToast] = useState(false);

  const handleFileDelete = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId)); // Remove the deleted file
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading files...</p>
        </div>
      ) : files.length === 0 ? ( // Show EmptyState if no files exist
        <>
          <EmptyState />
          {showToast && (
            <CustomToast
              message="No files found. Please upload some files."
              type="info"
            />
          )}
        </>
      ) : userRole === "admin" ? ( // Show FileTable for admin
        <FileTable files={files} onFileDelete={handleFileDelete} />
      ) : (
        // Show UserFileTable for non-admin users
        <UserFileTable files={files} onFileDelete={handleFileDelete} />
      )}
    </div>
  );
};

export default AdminDashboard;
