import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentSidebar from '../../components/Document/CommentSidebar';
import DocumentContent from '../../components/Document/DocumentContent';
import DocumentFooter from '../../components/Document/DocumentFooter';
import DocumentHeader from '../../components/Document/DocumentHeader';
import DocumentToolbar from '../../components/Document/DocumentToolbar';
import { useDocument } from '../../context/DocumentContext';

const DocumentViewerPage = () => {
    const { documentId } = useParams();
    const { getDocument, loading, document, annotations } = useDocument();
    const [showSidebar, setShowSidebar] = useState(true);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        getDocument(documentId || '41');
    }, [documentId]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading document...</div>;
    }

    if (!document) {
        return <div className="flex items-center justify-center h-screen">Document not found</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <DocumentHeader
                document={document}
                windowWidth={windowWidth}
                toggleMobileMenu={toggleMobileMenu}
            />

            {showMobileMenu && windowWidth < 640 && (
                <DocumentMobileMenu
                    toggleMobileMenu={toggleMobileMenu}
                    toggleSidebar={toggleSidebar}
                />
            )}

            <DocumentToolbar
                document={document}
                windowWidth={windowWidth}
                toggleSidebar={toggleSidebar}
                showSidebar={showSidebar}
            />

            <div className="flex flex-1 overflow-hidden">
                <DocumentContent
                    document={document}
                    windowWidth={windowWidth}
                    showSidebar={showSidebar}
                />

                {(showSidebar || windowWidth >= 768) && (
                    <CommentSidebar
                        annotations={annotations}
                        windowWidth={windowWidth}
                        setShowSidebar={setShowSidebar}
                    />
                )}
            </div>

            <DocumentFooter
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
            />
        </div>
    );
};

export default DocumentViewerPage;