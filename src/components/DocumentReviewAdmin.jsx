import "@cyntler/react-doc-viewer/dist/index.css";
import EmojiPicker from "emoji-picker-react";
import JSZip from "jszip";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Download,
  Edit,
  Menu,
  MessageSquare,
  Share,
  Share2,
  Smile,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserData, resolveAnnotationApi } from "../services/api";
import {
  API_BASE_URL,
  deleteComment as apiDeleteComment,
  updateComment as apiUpdateComment,
  fetchDocument,
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

const DocumentReviewAdmin = ({ documentId }) => {
  // Initial annotations with comment threads
  const [showPopup, setShowPopup] = useState(false);
  const [docs, setDocs] = useState([]);
  const [documentData, setDocumentData] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [ApprovedUsers, setApprovedUsers] = useState([]);
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
  const [currentUser, setCurrentUser] = useState({
    name: "Guest User",
    avatar: "G",
    avatarColor: getRandomColor(),
  });
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info", // default type
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy link!", "success");
    }
  };

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
      // Only check authentication if not a guest user
      try {
        const user = await fetchUserData();
        setCurrentUser({
          id: user._id,
          guestName: user.username || "Authenticated User",
          avatar: user.username[0].toUpperCase(),
          avatarColor: user.avatarColor,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

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

      // Extract approvals and map to the desired structure
      const approvedUsers =
        documentData.approvals?.map((approval) => ({
          name:
            approval.userId?.username || approval.guestName || "Unknown User", // Use username or guestName
          status: "approved", // Default status for approvals
        })) || [];

      // Combine main document, additional files, and versions into a single array
      const allDocs = [mainDoc, ...additionalFiles, ...versionDocs];

      // Update state with all documents
      setDocs(allDocs);
      setApprovedUsers(approvedUsers);
    }
  }, [documentData]);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const data = await fetchDocument(documentId);
        setDocumentData(data);
        // const filteredAnnotations = data.annotations.filter(
        //   (ann) => !ann.resolved
        // );
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
      guestName: null, // Add guestName if guest user, otherwise null
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

  const resolveAnnotation = async (fileId, annotationId) => {
    try {
      // Check if annotationId is valid
      const resolvedAnnotationId =
        !annotationId || annotationId === "undefined"
          ? activeAnnotation?._id || false
          : annotationId;
      console.log(activeAnnotation?._id);

      // Check if resolvedAnnotationId is valid
      if (!resolvedAnnotationId) {
        showToast("Invalid annotation ID.", "error");

        throw new Error("Invalid annotation ID.");
      }

      // Call the API to resolve the annotation
      await resolveAnnotationApi(fileId, resolvedAnnotationId);
      //   Remove the resolved annotation from the state
      // const updatedAnnotations = annotations.filter(
      //   (ann) => ann._id !== resolvedAnnotationId // Use _id instead of id if _id is the correct field
      // );

      const updatedAnnotations = annotations.map((ann) => {
        if (ann._id === resolvedAnnotationId) {
          return { ...ann, resolved: true }; // Add a `resolved` flag or update the status
        }
        return ann;
      });

      // Update the state
      setAnnotations(updatedAnnotations);

      // If the resolved annotation was active, reset the active annotation state
      if (activeAnnotation && activeAnnotation._id === annotationId) {
        setShowComments(false);
        setActiveAnnotation(null);
        setNewCommentText("");
        setEditingComment(null);
      }

      // Show success toast
      showToast("Annotation resolved successfully.", "success");

      console.log("Annotation resolved and removed:", annotationId);
    } catch (error) {
      console.error("Failed to resolve annotation:", error);

      // Show error toast
      showToast("Failed to resolve annotation.", "error");
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

  if (!documentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {toast.open && <CustomToast message={toast.message} type={toast.type} />}

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
            <button
              onClick={() => setShowPopup(true)}
              className="px-2 sm:px-4 py-2 bg-[#FF6F61] text-white rounded-full flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="30"
                viewBox="0 0 23 30"
                fill="none"
              >
                <path
                  d="M15.3576 24.3756C15.534 24.3756 15.7031 24.4489 15.8278 24.5794C15.9525 24.7098 16.0226 24.8868 16.0226 25.0713C16.0226 25.3246 15.9749 25.5754 15.8822 25.8094C15.7896 26.0434 15.6538 26.256 15.4827 26.4351C15.3115 26.6142 15.1083 26.7563 14.8847 26.8532C14.661 26.9501 14.4214 27 14.1793 27H5.38063C5.13857 27 4.89888 26.9501 4.67524 26.8532C4.45161 26.7563 4.24841 26.6142 4.07725 26.4351C3.90609 26.256 3.77032 26.0434 3.67768 25.8094C3.58505 25.5754 3.53737 25.3246 3.53737 25.0713C3.53737 24.8868 3.60743 24.7098 3.73213 24.5794C3.85684 24.4489 4.02597 24.3756 4.20233 24.3756C4.37869 24.3756 4.54782 24.4489 4.67252 24.5794C4.79723 24.7098 4.86728 24.8868 4.86728 25.0713C4.86728 25.1419 4.88056 25.2117 4.90636 25.2769C4.93216 25.3421 4.96997 25.4013 5.01764 25.4511C5.06531 25.501 5.1219 25.5406 5.18418 25.5676C5.24646 25.5946 5.31321 25.6085 5.38063 25.6085H14.1793C14.2467 25.6085 14.3135 25.5946 14.3757 25.5676C14.438 25.5406 14.4946 25.501 14.5423 25.4511C14.59 25.4013 14.6278 25.3421 14.6536 25.2769C14.6794 25.2117 14.6926 25.1419 14.6926 25.0713C14.6926 24.8868 14.7627 24.7098 14.8874 24.5794C15.0121 24.4489 15.1812 24.3756 15.3576 24.3756ZM5.08539 16.4049H14.4825C15.2982 16.4056 16.0803 16.7452 16.6569 17.349C17.2334 17.9528 17.5573 18.7714 17.5573 19.6249V21.9237C17.5573 22.2927 17.4172 22.6467 17.1677 22.9077C16.9183 23.1686 16.5801 23.3152 16.2274 23.3152H3.32991C2.97719 23.3152 2.63893 23.1686 2.38952 22.9077C2.14011 22.6467 2 22.2927 2 21.9237V19.6249C2 19.2013 2.07986 18.7819 2.23501 18.3907C2.39017 17.9995 2.61756 17.6441 2.90417 17.345C3.19078 17.0459 3.53097 16.8089 3.90526 16.6476C4.27955 16.4863 4.68059 16.4038 5.08539 16.4049ZM3.33257 21.9181H16.23V19.6249C16.2293 19.1416 16.0455 18.6784 15.719 18.3367C15.3924 17.995 14.9497 17.8027 14.4878 17.802H5.08539C4.8558 17.8009 4.62827 17.8472 4.41583 17.9383C4.20339 18.0294 4.01021 18.1634 3.84738 18.3328C3.68455 18.5021 3.55525 18.7034 3.46691 18.9251C3.37857 19.1469 3.33292 19.3847 3.33257 19.6249V21.9181ZM17.0732 14.4039C17.135 14.4686 17.2083 14.5201 17.2891 14.5551C17.3699 14.5902 17.4565 14.6083 17.544 14.6083C17.6314 14.6083 17.718 14.5902 17.7988 14.5551C17.8796 14.5201 17.953 14.4686 18.0148 14.4039L21.805 10.4408C21.9299 10.3101 22 10.1329 22 9.94817C22 9.7634 21.9299 9.58621 21.805 9.45556C21.6801 9.32492 21.5108 9.25152 21.3342 9.25152C21.1576 9.25152 20.9883 9.32492 20.8634 9.45556L17.544 12.926L16.1768 11.4956C16.052 11.3649 15.8826 11.2915 15.706 11.2915C15.5295 11.2915 15.3601 11.3649 15.2352 11.4956C15.1104 11.6262 15.0402 11.8034 15.0402 11.9882C15.0402 12.1729 15.1104 12.3501 15.2352 12.4808L17.0732 14.4039ZM15.073 5.53979C15.0732 6.55317 14.8063 7.54696 14.3017 8.41191C13.6588 9.46653 13.1794 10.6209 12.8813 11.8323C12.8175 12.1106 12.7563 12.4112 12.7004 12.709C12.9782 12.8294 13.2156 13.0333 13.3827 13.2948C13.5498 13.5563 13.6391 13.8638 13.6394 14.1784V14.9716C13.6394 15.1561 13.5693 15.3331 13.4446 15.4636C13.3199 15.5941 13.1508 15.6674 12.9744 15.6674C12.798 15.6674 12.6289 15.5941 12.5042 15.4636C12.3795 15.3331 12.3095 15.1561 12.3095 14.9716V14.1868C12.3095 14.1344 12.2896 14.0841 12.2541 14.047C12.2187 14.01 12.1707 13.9892 12.1206 13.9892H7.44731C7.39722 13.9892 7.34918 14.01 7.31377 14.047C7.27835 14.0841 7.25846 14.1344 7.25846 14.1868V14.9799C7.25846 15.1645 7.1884 15.3414 7.0637 15.4719C6.93899 15.6024 6.76986 15.6757 6.5935 15.6757C6.41715 15.6757 6.24801 15.6024 6.12331 15.4719C5.99861 15.3414 5.92855 15.1645 5.92855 14.9799V14.1868C5.92877 13.8722 6.01807 13.5647 6.18518 13.3032C6.35229 13.0416 6.58971 12.8378 6.86747 12.7173C6.80895 12.4167 6.74777 12.1106 6.68128 11.8323C6.42378 10.6685 5.97369 9.56088 5.35137 8.55942C4.90136 7.83744 4.6187 7.01547 4.52592 6.159C4.43313 5.30254 4.53278 4.43523 4.81692 3.62617C5.10107 2.81711 5.56185 2.08867 6.16258 1.49886C6.76331 0.909048 7.48737 0.474175 8.27709 0.22888C9.06682 -0.0164143 9.90037 -0.0653519 10.7114 0.0859661C11.5224 0.237284 12.2884 0.584676 12.9484 1.10047C13.6084 1.61626 14.1442 2.2862 14.513 3.05692C14.8819 3.82764 15.0736 4.67784 15.073 5.53979ZM13.7431 5.53979C13.7434 4.89453 13.5997 4.25811 13.3234 3.68123C13.0471 3.10435 12.6458 2.60295 12.1517 2.21698C11.6575 1.831 11.0839 1.57111 10.4768 1.45801C9.86966 1.34491 9.24567 1.38172 8.65453 1.56552C8.06338 1.74932 7.52143 2.07502 7.07183 2.51668C6.62224 2.95833 6.27742 3.50375 6.06486 4.10947C5.8523 4.71519 5.77786 5.36448 5.84747 6.00562C5.91708 6.64676 6.12883 7.26203 6.46583 7.80242C7.17265 8.93922 7.68395 10.1966 7.97661 11.5178C8.0564 11.8657 8.12556 12.2303 8.19471 12.5976H11.3705C11.437 12.2303 11.5088 11.8685 11.5886 11.5206C11.9176 10.1627 12.4509 8.86816 13.1686 7.68553C13.5449 7.03911 13.7436 6.29669 13.7431 5.53979Z"
                  fill="white"
                />
              </svg>

              <span className="hidden sm:inline">Approved User List</span>
            </button>
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
              <Share size={20} />
              <span className="text-xs mt-1">Share</span>
            </button>
            <button
              onClick={() => setShowPopup(true)}
              className="p-2 flex flex-col items-center justify-center border rounded bg-red-500 text-white"
            >
              <Check size={20} />
              <span className="text-xs mt-1">Approved User List</span>
            </button>
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
            onDoubleClick={handleDocumentDoubleClick}
            style={{ minHeight: "600px" }}
          >
            {/* <h2 className="text-xl sm:text-2xl font-bold mb-4">Ein Hoch auf die Expertise</h2>

                        <ul className="space-y-4 mb-6">
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>Eine weitere Möglichkeit mit KI erstellte Bilder aufs nächste zu heben ist die Verwendung von Fachbegriffen im Prompt.</p>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <p>So können diverse facheinschlägige Beschreibungen dabei helfen, dem Modell diverse Detailinformationen zu vermitteln.</p>
                            </li>
                        </ul> */}
            {/* {documentData && documentData.type === "pdf" ? (
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
              />
            ) : (
              <img
                src={`${API_BASE_URL}/${documentData.path}`}
                alt={documentData.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            )} */}

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
              className="absolute top-1/4 z-50 right-4 sm:right-1/4 bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:w-96"
              style={{ top: activeAnnotation.y + 50, left: activeAnnotation.x }}
            >
              <div className="flex justify-between items-center p-4">
                <h3 className="font-bold text-sm text-gray-700">
                  Comments on Annotation #{activeAnnotation.id}
                </h3>

                <div className="flex gap-2">
                  <button
                    className={`text-[#FF6F61] ${
                      activeAnnotation.resolved
                        ? "text-green-500"
                        : "text-[#FF6F61]"
                    } cursor-pointer`}
                    onClick={() =>
                      resolveAnnotation(documentId, activeAnnotation._id)
                    }
                  >
                    <CircleCheck size="20" />
                  </button>

                  <button
                    onClick={closeCommentPopup}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
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

      {/* Approved Users Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-modal-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {" "}
                Approved Users{" "}
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3 h-[200px] overflow-auto">
              {ApprovedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-800 font-medium">
                    {" "}
                    {user.name}{" "}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

export default DocumentReviewAdmin;

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
        </div>
      </div>
    </div>
  );
};
