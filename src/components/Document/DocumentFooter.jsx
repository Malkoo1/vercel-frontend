import { MessageSquare, MoreHorizontal } from "lucide-react";

const SidebarToggleButton = ({ showSidebar, toggleSidebar }) => {
    return (
        <button
            className={`p-1 ${showSidebar ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'} rounded`}
            onClick={toggleSidebar}
        >
            <MessageSquare size={16} />
        </button>
    );
};

const ProgressSection = () => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">60%</span>
            <button className="p-1 text-gray-400">
                <MoreHorizontal size={16} />
            </button>
        </div>
    );
};

const DocumentFooter = ({ showSidebar, toggleSidebar }) => {
    return (
        <footer className="bg-white border-t border-gray-200 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <SidebarToggleButton showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
            </div>
            <ProgressSection />
        </footer>
    );
};

export default DocumentFooter;
