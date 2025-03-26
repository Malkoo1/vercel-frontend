// layouts/AdminLayout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { SubHeader } from "../components/SubHeader";
import { TopNavbar } from "../components/TopNavbar";
import { UserSidebar } from "../components/UserSidebar";
import { UserSubHeader } from "../components/UserSubHeader";
import { FolderProvider } from "../context/FolderContext";
import { fetchUserData } from "../services/api";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  return (
    <FolderProvider>
      <div className="min-h-screen h-screen bg-gray-50 flex overflow-hidden">
        {/* Sidebar */}
        {userRole === "admin" ? (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        ) : (
          <UserSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <TopNavbar
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {userRole === "admin" ? <SubHeader /> : <UserSubHeader />}

          {/* <SubHeader /> */}
          {/* Outlet for nested routes */}
          <main className="flex-1 bg-white overflow-x-auto h-[calc(100vh-71px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </FolderProvider>
  );
};

export default AdminLayout;
