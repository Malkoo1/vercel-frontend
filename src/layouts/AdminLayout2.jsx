import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { SubHeader } from "../components/SubHeader";
import { TopNavbar } from "../components/TopNavbar";
import { getFolderById, listFoldersForUser } from "../services/api"; // Import the API function

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]); // Initialize as empty array
    const [selectedFolder, setSelectedFolder] = useState(""); // Initialize as empty string or handle default selection later

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const fetchedFolders = await listFoldersForUser();
                setFolders(fetchedFolders);
                if (fetchedFolders.length > 0) {
                    console.log(fetchedFolders[0]._id);
                    handleFolderSelect(fetchedFolders[0]._id); // Assuming _id is the unique identifier from backend
                }
            } catch (error) {
                console.error("Error fetching folders:", error);
                // Handle error - e.g., display error message to the user
                if (error.includes("Unauthorized")) {
                    // Redirect to login or handle token expiry
                    console.log("Redirect to login page or clear session due to unauthorized access");
                    // Optionally redirect to login page using useNavigate from react-router-dom
                    // Example: navigate('/login');  (import useNavigate and define navigate = useNavigate())
                }
            }
        };

        fetchFolders();
    }, []); // Empty dependency array means this effect runs only once on mount

    const [isLoading, setIsLoading] = useState(false);

    const handleFolderSelect = async (folderId) => {
        setIsLoading(true);
        try {
            const folderDetails = await getFolderById(folderId);
            setFiles(folderDetails.files);
            setFolders((prevFolders) => {
                const updatedFolders = prevFolders.map((folder) => ({
                    ...folder,
                    active: folder._id === folderId,
                }));
                return updatedFolders;
            });

            const selected = folders.find(folder => folder._id === folderId);
            if (selected) {
                setSelectedFolder(selected.name);
                console.log("Selected Folder Details:", folderDetails);
            } else {
                setSelectedFolder("");
            }
        } catch (error) {
            console.error("Error fetching folder details:", error);
            if (error.includes("Unauthorized")) {
                // Redirect to login or handle token expiry
                console.log("Redirect to login page or clear session due to unauthorized access");
                // Optionally redirect to login page using useNavigate from react-router-dom
                // Example: navigate('/login');  (import useNavigate and define navigate = useNavigate())
            }
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleFolderCreated = (changedFolder) => { // Renamed from newFolder to changedFolder to reflect both create and update
        console.log("Folder changed in AdminLayout:", changedFolder);
        // Refetch folders to update the list with the new/updated folder
        const fetchUpdatedFolders = async () => {
            try {
                const fetchedFolders = await listFoldersForUser();
                setFolders(fetchedFolders);

                if (changedFolder) { // Select the changed folder (newly created or updated)
                    handleFolderSelect(changedFolder._id);
                }
            } catch (error) {
                console.error("Error refetching folders after create/update:", error);
                // Handle error, maybe show a message to the user that folder list refresh failed
            }
        };
        fetchUpdatedFolders();
    };
    useEffect(() => { // useEffect to log folders state changes
        console.log("Folders state updated:", folders); // Log folders whenever it changes
    }, [folders]);

    return (
        <div className="min-h-screen h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                folders={folders}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                handleFolderSelect={handleFolderSelect}
                handleFolderCreated={handleFolderCreated}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <TopNavbar
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <SubHeader selectedFolder={selectedFolder} />
                {/* Outlet for nested routes */}
                <main className="flex-1 overflow-x-auto h-[calc(100vh-71px)]">
                    <Outlet context={{ isSidebarOpen, setIsSidebarOpen, files, setFiles, isMobileMenuOpen, setIsMobileMenuOpen }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;