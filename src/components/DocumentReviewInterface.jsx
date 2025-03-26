import "@cyntler/react-doc-viewer/dist/index.css";
import EmojiPicker from "emoji-picker-react";
import JSZip from "jszip";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Menu,
  MessageSquare,
  Share2,
  Smile,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserData, generatePDF } from "../services/api";
import {
  API_BASE_URL,
  deleteComment as apiDeleteComment,
  updateComment as apiUpdateComment,
  approveDocument,
  fetchDocument,
  revokeApproval,
  saveAnnotation,
  saveComment,
} from "../services/api2";
import PDFToImage from "./PDFToImage";
import CustomToast from "./Toast";

const getRandomColor = () => {
  const tailwindColors = [
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
    "bg-red-900",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-yellow-800",
    "bg-yellow-900",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-blue-800",
    "bg-blue-900",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-indigo-800",
    "bg-indigo-900",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-700",
    "bg-purple-800",
    "bg-purple-900",
    "bg-pink-500",
    "bg-pink-600",
    "bg-pink-700",
    "bg-pink-800",
    "bg-pink-900",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
    "bg-stone-500",
    "bg-stone-600",
    "bg-stone-700",
    "bg-stone-800",
    "bg-stone-900",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-700",
    "bg-amber-800",
    "bg-amber-900",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-lime-800",
    "bg-lime-900",
    "bg-teal-500",
    "bg-teal-600",
    "bg-teal-700",
    "bg-teal-800",
    "bg-teal-900",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-cyan-800",
    "bg-cyan-900",
    "bg-sky-500",
    "bg-sky-600",
    "bg-sky-700",
    "bg-sky-800",
    "bg-sky-900",
    "bg-rose-500",
    "bg-rose-600",
    "bg-rose-700",
    "bg-rose-800",
    "bg-rose-900",
    // Add more Tailwind background color classes as needed
  ];
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return tailwindColors[randomIndex];
};

const annotationColors = [
  "bg-red-500",
  "bg-red-600",
  "bg-red-700",
  "bg-red-800",
  "bg-red-900",
  "bg-orange-500",
  "bg-orange-600",
  "bg-orange-700",
  "bg-orange-800",
  "bg-orange-900",
  "bg-yellow-500",
  "bg-yellow-600",
  "bg-yellow-700",
  "bg-yellow-800",
  "bg-yellow-900",
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800",
  "bg-blue-900",
  "bg-indigo-500",
  "bg-indigo-600",
  "bg-indigo-700",
  "bg-indigo-800",
  "bg-indigo-900",
  "bg-purple-500",
  "bg-purple-600",
  "bg-purple-700",
  "bg-purple-800",
  "bg-purple-900",
  "bg-pink-500",
  "bg-pink-600",
  "bg-pink-700",
  "bg-pink-800",
  "bg-pink-900",
  "bg-gray-500",
  "bg-gray-600",
  "bg-gray-700",
  "bg-gray-800",
  "bg-gray-900",
  "bg-stone-500",
  "bg-stone-600",
  "bg-stone-700",
  "bg-stone-800",
  "bg-stone-900",
  "bg-amber-500",
  "bg-amber-600",
  "bg-amber-700",
  "bg-amber-800",
  "bg-amber-900",
  "bg-lime-500",
  "bg-lime-600",
  "bg-lime-700",
  "bg-lime-800",
  "bg-lime-900",
  "bg-teal-500",
  "bg-teal-600",
  "bg-teal-700",
  "bg-teal-800",
  "bg-teal-900",
  "bg-cyan-500",
  "bg-cyan-600",
  "bg-cyan-700",
  "bg-cyan-800",
  "bg-cyan-900",
  "bg-sky-500",
  "bg-sky-600",
  "bg-sky-700",
  "bg-sky-800",
  "bg-sky-900",
  "bg-rose-500",
  "bg-rose-600",
  "bg-rose-700",
  "bg-rose-800",
  "bg-rose-900",
];

const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const DocumentReviewInterface = ({ documentId }) => {
  // Initial annotations with comment threads
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [documentData, setDocumentData] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [nextAnnotationId, setNextAnnotationId] = useState(3);
  const [nextCommentId, setNextCommentId] = useState(4);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuestPopupOpen, setIsGuestPopupOpen] = useState(false);
  const [guestUserName, setGuestUserName] = useState("");
  const [guestAvatarColor, setGuestAvatarColor] = useState("");
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Guest User",
    avatar: "G",
    avatarColor: getRandomColor(),
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info", // default type
  });

  const handleRevoke = async () => {
    try {
      // Prepare revocation data
      const revocationData = {
        userId: isAuthenticated ? currentUser.id : undefined, // Use undefined instead of null
        guestName: isGuestUser ? currentUser.guestName : undefined,
      };

      // Remove undefined values
      const payload = Object.fromEntries(
        Object.entries(revocationData).filter(([_, v]) => v !== undefined)
      );

      // Call the API function
      const updatedDocument = await revokeApproval(documentId, payload);

      // Update document state with new data
      setDocumentData(updatedDocument.document);
      const storedSessionData = sessionStorage.getItem("currentUserSession");
      if (storedSessionData) {
        const sessionData = JSON.parse(storedSessionData);
        sessionData.approved = false;
        sessionStorage.setItem(
          "currentUserSession",
          JSON.stringify(sessionData)
        );
      }

      setIsApproved(false);

      // Show success toast
      showToast("Approval revoked successfully!", "success");
    } catch (error) {
      console.error(
        "Failed to revoke approval:",
        error.response?.data?.message || error.message
      );
      showToast("Failed to revoke approval", "error");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useCallback to prevent re-creation on every render if passed as props
  const showToast = useCallback(
    (message, type = "info") => {
      setToast({ open: true, message, type });
      // Automatically close the toast after a delay (optional)
      setTimeout(() => {
        setToast({ ...toast, open: false }); // Keep type and message, just close
      }, 5000); // Adjust delay as needed (e.g., 3000ms = 3 seconds)
    },
    [setToast]
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (!isGuestUser) {
        // Only check authentication if not a guest user
        try {
          const user = await fetchUserData();
          setCurrentUser({
            id: user._id,
            guestName: user.username || "Authenticated User",
            avatar: user.username[0].toUpperCase(),
            avatarColor: user.avatarColor,
          });
          setGuestUserName(user.username);
          setGuestAvatarColor(user.avatarColor);
          setIsAuthenticated(true);

          // Check if the current user has approved the document
          if (documentData && documentData.approvals) {
            const userHasApproved = documentData.approvals.some(
              (approval) => approval.userId?._id === user._id // Assuming user._id is the correct identifier
            );
            //  Here you would set state based on userHasApproved (e.g., setApprovalStatus)
            //  For example:
            setIsApproved(userHasApproved);
            console.log(isApproved);
          }
        } catch (error) {
          // console.error("Authentication error:", error);
          const storedSessionData =
            sessionStorage.getItem("currentUserSession");
          if (storedSessionData) {
            const sessionData = JSON.parse(storedSessionData);
            const currentTime = Date.now();
            if (sessionData.expiry > currentTime) {
              setCurrentUser(sessionData.currentUser);
              setGuestUserName(sessionData.currentUser.guestName);
              setGuestAvatarColor(sessionData.currentUser.avatarColor);
              setIsGuestUser(sessionData.currentUser.guestName ? true : false); // Update isGuestUser based on stored data
              setIsApproved(sessionData.approved);
              return true; // Session found and user set
            } else {
              // Session has expired, clear it
              sessionStorage.removeItem("currentUserSession");
            }
          }
          setIsAuthenticated(false);
          setIsGuestPopupOpen(true);
        }
      }
    };

    checkAuth();
  }, [isGuestUser, documentData]);

  const handleGuestNameSubmit = (name) => {
    setGuestUserName(name);
    setGuestAvatarColor(getRandomColor());

    const newUser = {
      id: null,
      guestName: name,
      avatar: name[0].toUpperCase(),
      avatarColor: guestAvatarColor || getRandomColor(),
    };
    setCurrentUser(newUser);
    // setCurrentUser({
    //   id: null,
    //   guestName: name,
    //   avatar: name[0].toUpperCase(),
    //   avatarColor: guestAvatarColor || getRandomColor(), // Use the generated color
    // });
    setIsGuestUser(true);

    // Store currentUser details in sessionStorage with a timestamp
    const expiryTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const sessionData = {
      currentUser: newUser,
      expiry: expiryTime,
      approved: false,
    };
    sessionStorage.setItem("currentUserSession", JSON.stringify(sessionData));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy link!", "success");
    }
  };

  useEffect(() => {
    if (documentData) {
      // Extract main document details
      const mainDoc = {
        uri: `${API_BASE_URL}/${documentData.path}`, // Construct full URI for the main document
        name: documentData.name,
        type: documentData.type,
      };

      // Extract additional files if available
      const additionalFiles =
        documentData.additionalFiles?.map((file) => ({
          uri: `${API_BASE_URL}/${file.path}`, // Construct full URI for additional files
          name: file.name,
          type: file.type,
        })) || [];

      // Extract versions if available
      const versionDocs =
        documentData.versions?.map((version) => ({
          uri: `${API_BASE_URL}/${version.path}`, // Construct full URI for versions
          name: version.name,
          type: version.type,
        })) || [];

      // Combine main document, additional files, and versions into a single array
      const allDocs = [mainDoc, ...additionalFiles, ...versionDocs];

      // Update state with all documents
      setDocs(allDocs);
    }
  }, [documentData]);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const data = await fetchDocument(documentId);
        setDocumentData(data);
        setAnnotations(data.annotations);
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    loadDocument();
  }, [documentId]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDocumentDoubleClick = async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation = {
      id: nextAnnotationId,
      x,
      y,
      comments: [],
    };

    try {
      const savedAnnotation = await saveAnnotation(documentId, newAnnotation);
      setAnnotations([...annotations, savedAnnotation]);
      setNextAnnotationId(nextAnnotationId + 1);
      setActiveAnnotation(savedAnnotation);
      setShowComments(true);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to save annotation:", error);
    }
  };

  const handleAnnotationClick = (annotation) => {
    setActiveAnnotation(annotation);
    setShowComments(true);
    setShowEmojiPicker(false);
    // On mobile, close the sidebar when opening a comment
    if (windowWidth < 768) {
      setShowSidebar(false);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const closeCommentPopup = () => {
    setShowComments(false);
    setActiveAnnotation(null);
    setNewCommentText("");
    setEditingComment(null);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: nextCommentId, // Frontend ID
      text: newCommentText,
      time: "Just now", // Backend will provide the actual timestamp
      edited: false,
      userId: isAuthenticated ? currentUser.id : null, // Add userId if authenticated, otherwise null
      guestName: isGuestUser ? guestUserName : null, // Add guestName if guest user, otherwise null
      avatar: currentUser.avatar,
      avatarColor: currentUser.avatarColor,
    };

    try {
      const savedComment = await saveComment(
        documentId,
        activeAnnotation.id,
        newComment
      );
      const updatedAnnotations = annotations.map((annotation) => {
        if (annotation.id === activeAnnotation.id) {
          return {
            ...annotation,
            comments: [...annotation.comments, savedComment],
          };
        }
        return annotation;
      });

      setAnnotations(updatedAnnotations);
      setNextCommentId(nextCommentId + 1);
      setNewCommentText("");
      setActiveAnnotation(
        updatedAnnotations.find(
          (annotation) => annotation.id === activeAnnotation.id
        )
      );
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  const startEditComment = (annotation, comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.text);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const saveEditComment = async () => {
    if (!editCommentText.trim()) return;

    try {
      const updatedCommentFromBackend = await apiUpdateComment(
        documentId,
        activeAnnotation.id,
        editingComment.id,
        editCommentText
      );

      // Update the annotations array with the edited comment from the backend
      const updatedAnnotations = annotations.map((annotation) => {
        if (annotation.id === activeAnnotation.id) {
          return {
            ...annotation,
            comments: annotation.comments.map((comment) => {
              if (comment.id === editingComment.id) {
                return updatedCommentFromBackend; // Use the updated comment from the backend
              }
              return comment;
            }),
          };
        }
        return annotation;
      });

      // Update state
      setAnnotations(updatedAnnotations);

      // Update active annotation to reflect changes
      const updatedActiveAnnotation = updatedAnnotations.find(
        (annotation) => annotation.id === activeAnnotation.id
      );
      setActiveAnnotation(updatedActiveAnnotation);

      // Exit edit mode
      setEditingComment(null);
      setEditCommentText("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Optionally handle the error (e.g., show a message to the user)
    }
  };
  const deleteComment = async (annotation, comment) => {
    try {
      await apiDeleteComment(documentId, annotation.id, comment.id);
      const updatedAnnotations = annotations.map((ann) => {
        if (ann.id === annotation.id) {
          return {
            ...ann,
            comments: ann.comments.filter((com) => com.id !== comment.id),
          };
        }
        return ann;
      });

      setAnnotations(updatedAnnotations);
      if (activeAnnotation && activeAnnotation.id === annotation.id) {
        setActiveAnnotation(
          updatedAnnotations.find((ann) => ann.id === annotation.id)
        );
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const addEmojiToComment = (emojiObject) => {
    if (editingComment) {
      setEditCommentText(editCommentText + emojiObject.emoji);
    } else {
      setNewCommentText(newCommentText + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleApprove = async () => {
    try {
      // Prepare approval data
      const approvalData = {
        userId: isAuthenticated ? currentUser.id : null, // For registered users
        guestName: isGuestUser ? currentUser.guestName : null, // For guest users
        avatar: isGuestUser ? currentUser.avatar : null, // Optional for guest users
        avatarColor: currentUser.avatarColor, // Optional for guest users
      };

      // Call the API function
      const updatedDocument = await approveDocument(documentId, approvalData);

      // Update document state with new data
      setDocumentData(updatedDocument.document);

      const storedSessionData = sessionStorage.getItem("currentUserSession");
      if (storedSessionData) {
        const sessionData = JSON.parse(storedSessionData);
        sessionData.approved = true;
        sessionStorage.setItem(
          "currentUserSession",
          JSON.stringify(sessionData)
        );
      }

      setIsApproved(true);

      // Show success toast
      showToast("Approval saved successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Failed to save approval", "error");
    }
  };

  const handleDownload = async () => {
    if (documentData) {
      const zip = new JSZip();

      try {
        // Fetch all files and add them to the zip
        await Promise.all(
          docs.map(async (file) => {
            const response = await fetch(file.url);
            const data = await response.blob();
            zip.file(file.name, data);
          })
        );

        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipName = `${documentData.name.split(".")[0]}-and-versions.zip`; //create zip file name

        // Trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = zipName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error creating ZIP file:", error);
        showToast("Error creating ZIP file.", "error");
      }
    } else {
      console.error("Document data is missing.");
      showToast("Unable to download documents. Please try again.", "error");
    }
  };

  const pdfRef = useRef(null);

  const handleDownload23 = async () => {
    try {
      if (!pdfRef.current) {
        throw new Error("No content to generate PDF");
      }

      // Create HTML with proper structure
      const htmlContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        width: 210mm;
                        margin: 0 auto;
                    }
                    img { max-width: 100% !important; height: auto !important; }
                </style>
            </head>
            <body>
                <div class="print-container">
                    ${pdfRef.current.outerHTML}
                </div>
            </body>
        </html>`;

      const pdfUrl = await generatePDF(htmlContent);

      // Create download link
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      }, 100);
    } catch (error) {
      console.error("Download Error:", error);
      alert(`PDF Generation Failed: ${error.message}`);
    }
  };

  if (!documentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {toast.open && <CustomToast message={toast.message} type={toast.type} />}
      <GuestUserPopup
        isOpen={!isAuthenticated && isGuestPopupOpen}
        onClose={() => setIsGuestPopupOpen(false)}
        onGuestNameSubmit={handleGuestNameSubmit}
      />
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 py-2">
        <Link
          to="/dashboard"
          className="flex w-[40px] h-[40px] justify-center items-center gap-2 shrink-0 rounded-[15px] bg-[#FF6F61] p-2 text-white mr-2 sm:mr-4"
        >
          <ArrowLeft size={20} />
        </Link>

        {windowWidth < 640 ? (
          <button onClick={toggleMobileMenu} className="p-2 mr-2">
            <Menu size={20} />
          </button>
        ) : (
          <div className="p-2 mr-4">
            <img
              alt="SATO studio logo"
              width="120"
              height="40"
              class="mr-2"
              src="/dash_logo.png"
            ></img>
            {/* <div className="text-red-500 font-bold">S</div> */}
          </div>
        )}

        <div className="flex-1 truncate">
          <h1 className="font-bold text-sm sm:text-base truncate overflow-hidden whitespace-nowrap text-ellipsis">
            {documentData && documentData.name}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm truncate">
            {documentData && documentData.description}{" "}
            <Check size={12} className="inline text-gray-400" />
          </p>
        </div>

        {windowWidth >= 640 && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex w-[40px] h-[40px] cursor-pointer justify-center items-center gap-2 shrink-0 rounded-[15px] border-[1px] border-[#FF6F61] text-[#FF6F61] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] p-[10px_10px]"
            >
              <Share2 size={20} />
            </button>
            <div className="relative" ref={dropdownRef}>
              {isApproved ? (
                <div className="flex gap-2">
                  <button
                    className="p-2 flex items-center gap-2 border rounded-full bg-green-500 text-white"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Check size={20} />
                    <span>Approved</span>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleRevoke}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X size={16} />
                          <span>Revoke Approval</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 flex items-center bg-[#FF6F61] text-white rounded-full flex items-center gap-2"
                  >
                    <span>Approve</span>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleApprove}
                          className="w-full px-4 py-2 text-left text-[#FF6F61] hover:bg-blue-50 flex items-center gap-2"
                        >
                          <ChevronRight size={16} />
                          <span>Approve Now</span>
                        </button>
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className="px-2 sm:px-4 py-2 bg-[#FF6F61] text-white rounded-full flex items-center gap-1"
              onClick={handleDownload}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {/* <button className="p-2 rounded-full border border-gray-200">
            <MoreHorizontal size={20} />
          </button> */}
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && windowWidth < 640 && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="p-2 flex flex-col items-center justify-center border rounded"
            >
              <Share2 size={20} />
              <span className="text-xs mt-1">Share</span>
            </button>
            <div className="relative" ref={dropdownRef}>
              {isApproved ? (
                <div className="flex gap-2">
                  <button
                    className="p-2 flex items-center gap-2 border rounded-full bg-green-500 text-white"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Check size={20} />
                    <span>Approved</span>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleRevoke}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X size={16} />
                          <span>Revoke Approval</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 flex items-center bg-[#FF6F61] text-white rounded-full flex items-center gap-2"
                  >
                    <span>Approve</span>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleApprove}
                          className="w-full px-4 py-2 text-left text-[#FF6F61] hover:bg-blue-50 flex items-center gap-2"
                        >
                          <ChevronRight size={16} />
                          <span>Approve Now</span>
                        </button>
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white"
            >
              <Download size={20} />
              <span className="text-xs mt-1">Export</span>
            </button>
            <button
              className="p-2 flex flex-col items-center justify-center border rounded"
              onClick={toggleSidebar}
            >
              <MessageSquare size={20} />
              <span className="text-xs mt-1">Comments</span>
            </button>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="mt-4 w-full py-2 border rounded flex justify-center"
          >
            <X size={16} className="mr-2" /> Close Menu
          </button>
        </div>
      )}

      {/* Document Title Bar - Responsive */}
      <div className="bg-white py-2 px-2 sm:px-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center truncate">
          {/* <span className="mr-2">#</span> */}
          <h2 className="font-medium text-sm text-[#404040] sm:text-base truncate">
            {documentData && documentData.name}
          </h2>
        </div>

        <div className="flex items-center">
          {/* <div className="flex -space-x-2 mr-2 sm:mr-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-xs">
              C
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">
              A
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs">
              +3
            </div>
          </div>

          {windowWidth >= 640 && (
            <button className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-1">
              <span>Add Participant</span>
            </button>
          )} */}

          {windowWidth < 768 && (
            <button
              onClick={toggleSidebar}
              className="ml-2 p-2 border rounded-full"
            >
              <MessageSquare
                size={16}
                className={showSidebar ? "text-red-500" : "text-gray-500"}
              />
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document Area */}
        <div
          className={`${
            showSidebar && windowWidth < 768 ? "hidden" : "flex-1"
          } bg-gray-100 overflow-auto relative p-2 sm:p-4`}
        >
          {/* Document Content */}
          <div
            className="bg-white p-4 sm:p-6 rounded shadow-sm mx-auto max-w-3xl relative"
            ref={pdfRef}
            onDoubleClick={handleDocumentDoubleClick}
            style={{ minHeight: "600px" }}
          >
            {documentData ? (
              ["pdf"].includes(documentData.type) ? (
                <>
                  {docs.map((doc, index) => (
                    <PDFToImage key={index} pdfUrl={doc.uri} />
                  ))}
                  {documentData.additionalFiles?.length > 0 && (
                    <div className="mt-4">
                      {documentData.additionalFiles.map((file, index) => (
                        <PDFToImage
                          key={`pdf-${index}`}
                          pdfUrl={`${API_BASE_URL}/${file.path}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : ["png", "jpg", "jpeg", "webp"].includes(documentData.type) ? (
                <div>
                  <img
                    src={`${API_BASE_URL}/${documentData.path}`}
                    alt={documentData.name}
                    className="w-full rounded-lg shadow-md"
                    onError={(e) =>
                      (e.target.src = "path/to/fallback/image.png")
                    }
                  />
                  {documentData.additionalFiles?.length > 0 && (
                    <div className="mt-4">
                      {documentData.additionalFiles
                        .filter((file) =>
                          ["png", "jpg", "jpeg", "webp"].includes(file.type)
                        )
                        .map((file, index) => (
                          <img
                            key={`img-${index}`}
                            src={`${API_BASE_URL}/${file.path}`}
                            alt={file.name}
                            className="w-full rounded-lg shadow-md mt-4"
                            onError={(e) =>
                              (e.target.src = "path/to/fallback/image.png")
                            }
                          />
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">
                    Unsupported file type: {documentData.type}
                  </p>
                  <a
                    href={`${API_BASE_URL}/${documentData.path}`}
                    download={documentData.name}
                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Download File
                  </a>
                </div>
              )
            ) : (
              <p className="text-gray-700">No document data available.</p>
            )}

            {documentData?.versions?.length > 0 && (
              <div className="mb-4">
                {[
                  ...new Map(
                    documentData.versions.map((v) => [v.path, v])
                  ).values(),
                ].map((version) => (
                  <PDFToImage
                    key={`pdf-${version.id}-${version.path}`}
                    pdfUrl={`${API_BASE_URL}/${version.path}`}
                  />
                ))}
              </div>
            )}

            {/* Annotation Markers */}
            {annotations &&
              annotations.map((annotation, index) => (
                <div
                  key={annotation.id}
                  className="absolute z-40"
                  style={{ top: annotation.y, left: annotation.x }}
                  onClick={() => handleAnnotationClick(annotation)}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg text-xs ${
                      annotation.resolved
                        ? "bg-green-500"
                        : annotationColors[index % annotationColors.length]
                    }`}
                  >
                    {annotation.id}
                  </div>
                </div>
              ))}
          </div>

          {/* Comment Popup - Now with Edit & Delete */}
          {showComments && activeAnnotation && (
            <div
              className="absolute z-50 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96"
              style={{ top: activeAnnotation.y + 50, left: activeAnnotation.x }}
            >
              <div className="flex justify-between items-center p-4">
                <h3 className="font-bold text-sm text-gray-700">
                  Comments on Annotation #{activeAnnotation.id}
                </h3>
                <button
                  onClick={closeCommentPopup}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size="20" />
                </button>
              </div>

              <div className="p-4 max-h-[120px] overflow-y-auto">
                {activeAnnotation.comments.length > 0 ? (
                  activeAnnotation.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start mb-4">
                      <div
                        className={`w-8 h-8 rounded-full ${comment.avatarColor} flex items-center justify-center text-white mr-2`}
                      >
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm text-[#868686]">
                            {comment.userId
                              ? comment.userId.username
                              : comment.guestName}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-[#868686] ml-2">
                              {timeAgo(comment.updatedAt)}
                              {comment.edited && (
                                <span className="italic ml-1">(edited)</span>
                              )}
                            </span>
                            {comment.avatar === currentUser.avatar && (
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    startEditComment(activeAnnotation, comment)
                                  }
                                  className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteComment(activeAnnotation, comment)
                                  }
                                  className="ml-1 text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingComment && editingComment.id === comment.id ? (
                          <div className="mt-1">
                            <textarea
                              className="w-full p-2 border rounded text-sm bg-gray-100"
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEditComment}
                                className="px-3 py-1 text-xs border rounded text-gray-500 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveEditComment}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded cursor-pointer"
                                disabled={!editCommentText.trim()}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#A1A1A1] mt-1">
                            {comment.text}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-white mr-2`}
                  >
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1 flex justify-between align-middle relative bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="bg-transparent w-full outline-none text-sm"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment()
                      }
                    />
                    <button
                      onClick={handleAddComment}
                      className=" text-red-500 rounded-full text-sm cursor-pointer"
                      disabled={!newCommentText.trim()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29"
                        height="30"
                        viewBox="0 0 29 30"
                        fill="none"
                      >
                        <path
                          d="M15.6628 9.36729L8.09678 11.8893C3.0115 13.5805 3.0115 16.3618 8.09678 18.0529L9.63474 18.5656C10.0826 18.7188 10.4302 19.0664 10.5834 19.5143L11.0902 21.0463C12.7814 26.1316 15.5568 26.1375 17.2538 21.0463L19.7758 13.4803C20.9072 10.0862 19.0569 8.23592 15.6628 9.36729ZM16.258 13.769L13.076 16.951C12.8344 17.1926 12.4337 17.1926 12.1921 16.951C11.9505 16.7094 11.9505 16.3087 12.1921 16.0671L15.3741 12.8851C15.6157 12.6436 16.0164 12.6436 16.258 12.8851C16.4996 13.1267 16.4996 13.5274 16.258 13.769Z"
                          fill="#739DF9"
                        />
                      </svg>
                      {/* <Navigation /> */}
                      {/* Post Comment */}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={toggleEmojiPicker}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <Smile size={20} />
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute bottom-24 left-0 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-10">
                    <EmojiPicker onEmojiClick={addEmojiToComment} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Now Toggleable on Mobile */}
        {(showSidebar || windowWidth >= 768) && (
          <div
            className={`${
              windowWidth < 768 ? "absolute inset-0 z-10" : "w-64 md:w-80"
            } bg-white border-l border-gray-200 overflow-auto h-full`}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Annotations & Comments</h3>
              {windowWidth < 768 && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-4">
              {annotations &&
                annotations.map((annotation, index) => (
                  <div key={annotation.id} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 ${
                          annotation.resolved
                            ? "bg-green-500"
                            : annotationColors[index % annotationColors.length]
                        }`}
                      >
                        {annotation.id}
                      </div>
                      <h4 className="font-medium text-sm text-[#404040]">
                        Annotation #{annotation.id}
                      </h4>
                      <button
                        className="ml-auto text-red-500 text-xs"
                        onClick={() => handleAnnotationClick(annotation)}
                      >
                        View
                      </button>
                    </div>

                    {annotation.comments.length > 0 ? (
                      <div className="ml-4 space-y-4">
                        {annotation.comments.map((comment) => (
                          <div key={comment.id} className="mb-3">
                            <div className="flex items-start">
                              <div
                                className={`w-6 h-6 rounded-full ${comment.avatarColor} flex items-center justify-center text-white text-xs mr-2 flex-shrink-0`}
                              >
                                {comment.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1 flex-wrap">
                                  <p className="font-medium text-xs text-[#868686]">
                                    {comment.userId
                                      ? comment.userId.username
                                      : comment.guestName}
                                  </p>
                                  <div className="right_side flex justify-center align-middle gap-2">
                                    <span className="text-xs  text-[#868686] ml-2">
                                      {timeAgo(comment.updatedAt)}
                                      {comment.edited && (
                                        <span className="italic ml-1">
                                          (update)
                                        </span>
                                      )}
                                    </span>
                                    {/* Comment action buttons in sidebar */}
                                    {comment.avatar === currentUser.avatar && (
                                      <div className="flex mt-1 gap-1">
                                        <button
                                          className="text-xs text-blue-500"
                                          onClick={() => {
                                            handleAnnotationClick(annotation);
                                            setTimeout(
                                              () =>
                                                startEditComment(
                                                  annotation,
                                                  comment
                                                ),
                                              100
                                            );
                                          }}
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          className="text-xs text-red-500"
                                          onClick={() =>
                                            deleteComment(annotation, comment)
                                          }
                                        >
                                          <Trash size={12} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs text-[#A1A1A1]">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="ml-8 text-gray-500 text-xs italic">
                        No comments yet
                      </p>
                    )}

                    <div className="w-full h-px bg-gray-100 mt-4"></div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <footer className="bg-white border-t border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className={`p-1 ${
              showSidebar
                ? "bg-red-100 text-red-500"
                : "bg-gray-100 text-gray-400"
            } rounded`}
            onClick={toggleSidebar}
          >
            <MessageSquare size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">60%</span>
          <button className="p-1 text-gray-400">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </footer> */}
    </div>
  );
};

export default DocumentReviewInterface;

const GuestUserPopup = ({ isOpen, onClose, onGuestNameSubmit }) => {
  const [guestName, setGuestName] = useState("");

  const handleSubmit = () => {
    if (guestName.trim()) {
      onGuestNameSubmit(guestName);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-modal-200 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      id="guestUserPopup"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Welcome Guest!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Please enter your name to continue as a guest.
            </p>
          </div>
          <div className="px-7 py-3">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 text-white text-base font-semibold rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Continue as Guest
            </button>
          </div>
          <div className="text-sm text-center text-gray-500">
            Already have an account?
            <Link
              to="/login"
              className="font-medium text-[#FD5E4F] hover:text-[#E04C40] ml-1"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
