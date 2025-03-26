import { ArrowLeft, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { IconSidebar } from '../components/IconSidebar';
import { NotificationContext } from '../context/NotificationContext';

function NotificationLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Use context for filters and sort
    const { filters, setFilters, sortBy, setSortBy } = useContext(NotificationContext);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <IconSidebar isMobileMenuOpen={isMobileMenuOpen} />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Notification</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort Button */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                onClick={() => {
                                    setShowSortMenu(!showSortMenu);
                                    setShowFilterMenu(false);
                                }}
                            >
                                <span>Sort By</span>
                                <ChevronDown size={16} />
                            </button>
                            {showSortMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => {
                                            setSortBy('newest');
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        Newest First
                                        {sortBy === 'newest' && <Check size={16} className="text-red-500" />}
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                                        onClick={() => {
                                            setSortBy('oldest');
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        Oldest First
                                        {sortBy === 'oldest' && <Check size={16} className="text-red-500" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Filter Button */}
                        <div className="relative">
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => {
                                    setShowFilterMenu(!showFilterMenu);
                                    setShowSortMenu(false);
                                }}
                            >
                                <SlidersHorizontal size={20} className="text-gray-600" />
                            </button>
                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={filters.unreadOnly}
                                                onChange={(e) => setFilters(prev => ({ ...prev, unreadOnly: e.target.checked }))}
                                                className="rounded text-red-500 focus:ring-red-500"
                                            />
                                            Show unread only
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Notification Types</p>
                                        {Object.keys(filters.types).map((type) => (
                                            <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.types[type]}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        types: {
                                                            ...prev.types,
                                                            [type]: e.target.checked
                                                        }
                                                    }))}
                                                    className="rounded text-red-500 focus:ring-red-500"
                                                />
                                                {type.replace('_', ' ')}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Outlet for nested routes */}
                <Outlet />
            </div>
        </div>
    );
}

export default NotificationLayout;