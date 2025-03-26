import { FolderCode, Upload, Users } from 'lucide-react';

export const Header = ({ setIsMobileMenuOpen, setIsSidebarOpen }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                    <button
                        className="md:hidden mr-4 text-gray-500"
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        className="lg:hidden mr-4 text-gray-500"
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    >
                        <FolderCode className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">New Folder 22</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-white"
                                src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=32&h=32&fit=crop`}
                                alt={`User ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 flex items-center whitespace-nowrap font-medium">
                        <Upload className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Upload New File</span>
                        <span className="sm:hidden">Upload</span>
                    </button>
                </div>
            </div>
        </div>
    );
};