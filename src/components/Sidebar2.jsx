import { FolderCode, Pencil, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import CreateNewFolder from './CreateNewFolder';
import { IconSidebar } from './IconSidebar';

export const Sidebar = ({ folders, isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen, handleFolderSelect, handleFolderCreated }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [folderToUpdate, setFolderToUpdate] = useState(null);
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const openUpdateFolderModal = (folder) => {
        setFolderToUpdate(folder);
        handleFolderCreated(folder); // Set the folder to update
        setIsPopupOpen(true);
    };


    return (
        <>
            {/* Icon Sidebar */}
            <IconSidebar isMobileMenuOpen={isMobileMenuOpen} />
            {/* <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} relative w-16 h-screen md:block w-20 bg-white border-r border-gray-200 flex-shrink-0`}>
                <div className="h-screen flex flex-col items-center py-6">
                    <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-8">
                        <img
                            src="/circle_logo.png"
                            alt="SATO studio"
                            className="w-12 h-12 rounded-lg"
                        />
                    </div>

                    <nav className="flex-1 flex flex-col items-center space-y-6">
                        <button className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center">
                            <FolderCode className="w-6 h-6 text-coral-500" />
                        </button>
                        <button className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-400" />
                        </button>
                        <button className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-gray-400" />
                        </button>
                    </nav>

                    <div className="flex flex-col items-center space-y-4">
                        <button className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center">
                            <Info className="w-6 h-6 text-gray-400" />
                        </button>
                        <button className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center">
                            <LogOut className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Folders Sidebar */}
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} h-screen lg:block w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto`}>
                <div className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for a Folder"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm text-gray-700"
                        />
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-900">Folders List</h2>
                            <button className="text-gray-400 hover:text-gray-500">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* <div className="space-y-2">
                            {folders.map(folder => (

                                <button onClick={() => handleFolderSelect(folder._id)}
                                    key={folder._id}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm ${folder.active ? 'bg-coral-100 text-coral-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <FolderCode className="w-5 h-5 mr-3 text-gray-400" />
                                    {folder.name}

                                    <span onClick={() => openUpdateFolderModal(folder)}>Edit</span>
                                </button>
                            ))}
                        </div> */}

                        <div className="space-y-2">
                            {folders.map(folder => (
                                <div
                                    key={folder._id}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer ${folder.active ? 'bg-coral-100' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div
                                        className="flex items-center flex-1"
                                        onClick={() => handleFolderSelect(folder._id)}
                                    >
                                        <div className={`w-5 h-5 mr-3 ${folder.active ? 'text-coral-500' : 'text-gray-400'}`}>
                                            <FolderCode size={20} />
                                        </div>
                                        <span className={folder.active ? 'text-coral-600 font-medium' : 'text-gray-700'}>
                                            {folder.name}
                                        </span>
                                    </div>

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
                        </div>

                        <button onClick={openPopup} className="mt-6 w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Folder
                        </button>
                    </div>
                </div>
            </div >

            <CreateNewFolder
                isOpen={isPopupOpen}
                onClose={closePopup}
                onFolderCreated={handleFolderCreated}
                folder={folderToUpdate}
                SelectedFolder={handleFolderSelect} />
        </>
    );
};