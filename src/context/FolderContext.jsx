// contexts/FolderContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import CustomToast from "../components/Toast";
import {
  fetchUserData,
  getFolderById,
  getFolderShareById,
  listFoldersForUser,
} from "../services/api";

const FolderContext = createContext();

export const useFolders = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [allFiles, setAllFiles] = useState([]); // Store all files
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [shareDetail, setShareDetail] = useState("");
  const [shareFolder, setShareFolder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null); // State to store user role

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await fetchUserData(); // Fetch user data
        setUserRole(user.role); // Set the user's role
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest"); // Default to guest if there's an error
      }
    };

    fetchRole(); // Fetch the user's role when the component mounts
  }, []);

  useEffect(() => {
    // Filter files based on searchTerm
    const filteredFiles = allFiles.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiles(filteredFiles);
  }, [searchTerm, allFiles]);

  // State to manage toast visibility and content
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info", // default type
  });

  // useCallback to prevent re-creation on every render if passed as props
  const showToast = useCallback(
    (message, type = "info") => {
      setToast({ open: true, message, type });
      // Automatically close the toast after a delay (optional)
      setTimeout(() => {
        setToast({ ...toast, open: false }); // Keep type and message, just close
      }, 5000); // Adjust delay as needed (e.g., 3000ms = 3 seconds)
    },
    [setToast]
  );

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const fetchedFolders = await listFoldersForUser();
      setFolders(fetchedFolders.userFolders);
      setShareFolder(fetchedFolders.sharedFolders);
      if (fetchedFolders.userFolders.length > 0) {
        handleFolderSelect(fetchedFolders.userFolders[0]._id);
      } else if (fetchedFolders.sharedFolders.length > 0) {
        handleFolderSelect(fetchedFolders.sharedFolders[0]._id);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = async (folderId) => {
    setIsLoading(true);
    try {
      const folderDetails = await getFolderById(folderId);
      setAllFiles(folderDetails.files);
      setFolders((prevFolders) =>
        prevFolders.map((folder) => ({
          ...folder,
          active: folder._id === folderId,
        }))
      );
      setShareFolder((prevShareFolder) =>
        prevShareFolder.map((folder) => ({
          ...folder,
          active: folder._id === folderId,
        }))
      );
      setShareDetail("");

      // const selected = folders.find(folder => folder._id === folderId);
      setSelectedFolder(folderDetails.folder.name);
      setFolderId(folderId);
    } catch (error) {
      console.error("Error fetching folder details:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareFolderSelect = async (folderId) => {
    setIsLoading(true);
    try {
      const folderDetails = await getFolderShareById(folderId);
      setAllFiles(folderDetails.sharedFiles);
      setFolders((prevFolders) =>
        prevFolders.map((folder) => ({
          ...folder,
          active: folder._id === folderId,
        }))
      );
      setShareFolder((prevShareFolder) =>
        prevShareFolder.map((folder) => ({
          ...folder,
          active: folder._id === folderId,
        }))
      );
      setShareDetail("share");

      // const selected = folders.find(folder => folder._id === folderId);
      setSelectedFolder(folderDetails.folder.name);
      setFolderId(folderId);
    } catch (error) {
      console.error("Error fetching folder details:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderCreated = (changedFolder) => {
    fetchFolders();
    console.log("Error fetching folder details:");
    if (changedFolder) {
      console.log("Error fetching folder details:");
      handleFolderSelect(changedFolder._id);
    }
  };

  const handleApiError = (error) => {
    if (typeof error === "string" && error.includes("Unauthorized")) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log("Unauthorized access detected");
      // Add navigation logic here
    }
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        files,
        setFiles,
        selectedFolder,
        isLoading,
        folderId,
        userRole,
        handleFolderSelect,
        handleFolderCreated,
        handleShareFolderSelect,
        showToast,
        shareFolder,
        shareDetail,
        searchTerm, // Expose searchTerm
        setSearchTerm, // Expose setSearchTerm
      }}
    >
      {children}

      {toast.open && <CustomToast message={toast.message} type={toast.type} />}
    </FolderContext.Provider>
  );
};
