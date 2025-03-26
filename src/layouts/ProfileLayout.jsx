import { useState } from "react";
import { Outlet } from "react-router-dom";
import { IconSidebar } from '../components/IconSidebar';
import { ProfileNavbar } from "../components/ProfileNavbar";

const ProfileLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    return (
        <div className="min-h-screen h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <IconSidebar isMobileMenuOpen={isMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <ProfileNavbar
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    showMobileMenuButton={true} // Hide mobile menu button
                    showLogo={false} // Show logo
                    showSearchButton={false} // Show search button
                    showNotificationButton={false}
                    showHeadingButton={true}
                    setHeading="Page"
                />

                {/* <SubHeader selectedFolder={selectedFolder} /> */}
                {/* Outlet for nested routes */}
                <main className="flex-1 overflow-x-auto h-[calc(100vh-71px)]">
                    <Outlet context={{ isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }} />
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;