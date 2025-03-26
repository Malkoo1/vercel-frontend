// src/pages/DocumentReviewPage.js
import React, { useContext, useState } from "react";
import CommentPopup from "../../components/Doc/CommentPopup";
import DocumentTitleBar from "../../components/Doc/DocumentTitleBar";
import DocumentViewer from "../../components/Doc/DocumentViewer";
import Sidebar from "../../components/Doc/Sidebar";
import { AnnotationsContext } from "../../context/AnnotationsContext";
const DocumentPage = () => {
  const [showComments, setShowComments] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { activeAnnotation, setActiveAnnotation } =
    useContext(AnnotationsContext);

  const handleAnnotationClick = (annotation) => {
    setActiveAnnotation(annotation);
    setShowComments(true);
  };

  const closeCommentPopup = () => {
    setShowComments(false);
    setActiveAnnotation(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <DocumentTitleBar onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${
            showSidebar && window.innerWidth < 768 ? "hidden" : "flex-1"
          } bg-gray-100 overflow-auto relative p-2 sm:p-4`}
        >
          <DocumentViewer handleAnnotationClick={handleAnnotationClick} />
          {showComments && activeAnnotation && (
            <CommentPopup onClose={closeCommentPopup} />
          )}
        </div>
        <Sidebar showSidebar={showSidebar} onToggleSidebar={toggleSidebar} />
      </div>
    </>
  );
};

export default DocumentPage;
