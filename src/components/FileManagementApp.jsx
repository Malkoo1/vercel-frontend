import React, { useState } from 'react';

const FileManagementApp = () => {
    const [selectedFolder, setSelectedFolder] = useState("New Folder 2");
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRowExpansion = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const folders = [
        { id: 1, name: "New Folder 1", active: false },
        { id: 2, name: "New Folder 2", active: true },
        { id: 3, name: "TechVanta", active: false },
        { id: 4, name: "CodeSphere", active: false },
    ];

    const files = [
        {
            id: 1,
            name: "In-app-content.JPG",
            type: "jpg",
            description: "",
            date: "January 8, 2023",
            size: "12.5 MB",
            versions: [
                { id: 101, name: "In-app-content_v1.JPG", date: "January 5, 2023", size: "12.0 MB" },
                { id: 102, name: "In-app-content_draft.JPG", date: "January 3, 2023", size: "11.8 MB" }
            ]
        },
        {
            id: 2,
            name: "New Versions .JPG",
            type: "jpg",
            description: "I love to see this....",
            date: "January 8, 2023",
            size: "12.5 MB",
            versions: [
                { id: 201, name: "New Versions_backup.JPG", date: "January 7, 2023", size: "12.2 MB" },
                { id: 202, name: "New Versions_old.JPG", date: "January 6, 2023", size: "11.9 MB" }
            ]
        },
        { id: 3, name: "New Versions 2 .JPG", type: "jpg", description: "", date: "", size: "" },
        {
            id: 4,
            name: "style_guide.docx",
            type: "docx",
            description: "I love to see this....",
            date: "January 8, 2023",
            size: "12.5 MB",
            versions: [
                { id: 401, name: "style_guide_v2.docx", date: "January 7, 2023", size: "12.3 MB" },
                { id: 402, name: "style_guide_draft.docx", date: "January 5, 2023", size: "11.7 MB" }
            ]
        },
        { id: 5, name: "design_reviews_summary.doc", type: "doc", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 6, name: "color_palette.xlsx", type: "xlsx", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 7, name: "design_specs.pptx", type: "pptx", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 8, name: "final_mockup.psd", type: "psd", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 9, name: "UI_patterns_library.ai", type: "ai", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 10, name: "wireframe_sketches.jpg", type: "jpg", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 11, name: "icon_set.jpg", type: "jpg", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
        { id: 12, name: "user_flow_chart.pdf", type: "pdf", description: "I love to see this....", date: "January 8, 2023", size: "12.5 MB" },
    ];

    const getFileIcon = (type) => {
        switch (type) {
            case 'jpg':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-teal-600 rounded-sm text-white text-xs">
                        JPG
                    </div>
                );
            case 'docx':
            case 'doc':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-sm text-white text-xs">
                        W
                    </div>
                );
            case 'xlsx':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-sm text-white text-xs">
                        X
                    </div>
                );
            case 'pptx':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-sm text-white text-xs">
                        P
                    </div>
                );
            case 'psd':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-900 rounded-sm text-white text-xs">
                        Ps
                    </div>
                );
            case 'ai':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-orange-900 rounded-sm text-white text-xs">
                        Ai
                    </div>
                );
            case 'pdf':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-red-600 rounded-sm text-white text-xs">
                        PDF
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-600 rounded-sm text-white text-xs">
                        F
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-white">
                <div className="p-4">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-red-400 text-xl">★</span>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a Folder"
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 font-medium">Folders List</h3>
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            {folders.map(folder => (
                                <div
                                    key={folder.id}
                                    className={`flex items-center justify-between p-3 rounded-lg ${folder.active ? 'bg-red-200' : 'hover:bg-gray-100'}`}
                                    onClick={() => setSelectedFolder(folder.name)}
                                >
                                    <div className="flex items-center">
                                        <div className={`mr-2 text-gray-500 ${folder.active ? 'text-red-500' : ''}`}>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>
                                        <span className={`${folder.active ? 'text-red-500 font-medium' : 'text-gray-700'}`}>{folder.name}</span>
                                    </div>
                                    <button className="text-gray-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        <button className="flex items-center justify-center w-full py-2 rounded-lg hover:bg-gray-100 border border-gray-200">
                            <svg className="h-4 w-4 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-gray-600">Add New Folder</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                            <span className="text-red-400 text-xl">★</span>
                        </div>
                        <div>
                            <div className="text-gray-600 text-sm">SATO</div>
                            <div className="font-medium">studio</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Subheader */}
                <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold">{selectedFolder}</h1>
                        <button className="ml-2 text-gray-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map(id => (
                                <div key={id} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                    {id < 5 ? id : `+${id - 4}`}
                                </div>
                            ))}
                        </div>

                        <button className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>

                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Upload New File</span>
                        </button>
                    </div>
                </div>

                {/* File Table */}
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="w-10 px-6 py-3 text-left">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Upload
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File Size
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map(file => (
                                <React.Fragment key={file.id}>
                                    <tr
                                        className={`hover:bg-gray-50 cursor-pointer ${expandedRows[file.id] ? 'bg-gray-50' : ''}`}
                                        onClick={() => toggleRowExpansion(file.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 rounded"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getFileIcon(file.type)}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                                </div>
                                                {file.versions && file.versions.length > 0 && (
                                                    <svg
                                                        className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${expandedRows[file.id] ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400">{file.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{file.date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {file.size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                                <button className="text-gray-400 hover:text-gray-500">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-500">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-500">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Nested table for versions */}
                                    {expandedRows[file.id] && file.versions && file.versions.length > 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-0 py-0 border-b border-gray-200">
                                                <div className="bg-gray-100 p-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Versions</h4>
                                                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Version Name
                                                                </th>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Date
                                                                </th>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Size
                                                                </th>
                                                                <th scope="col" className="relative px-6 py-2">
                                                                    <span className="sr-only">Actions</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {file.versions.map(version => (
                                                                <tr key={version.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            {getFileIcon(file.type)}
                                                                            <div className="ml-3 text-sm font-medium text-gray-900">
                                                                                {version.name}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                        {version.date}
                                                                    </td>
                                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                        {version.size}
                                                                    </td>
                                                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                                        <div className="flex space-x-2 justify-end">
                                                                            <button className="text-gray-400 hover:text-gray-500">
                                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                </svg>
                                                                            </button>
                                                                            <button className="text-gray-400 hover:text-gray-500">
                                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FileManagementApp;