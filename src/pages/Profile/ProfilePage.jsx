import { Eye, EyeOff, Pencil } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomToast from "../../components/Toast";
import {
  API_BASE_URL,
  fetchUserData,
  updateUserProfile,
} from "../../services/api"; // Import the API functions
function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to hold the preview of the selected image
  const [selectedImageFile, setSelectedImageFile] = useState(null); // State to hold the actual file
  const [isImageEditMode, setIsImageEditMode] = useState(false); // State for image edit mode
  const [editUsername, setEditUsername] = useState(""); // State for editing username
  const [isUserEmail, setisUserEmail] = useState(""); // State for editing username

  const fileInputRef = useRef(null);

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // useCallback to prevent re-creation on every render if passed as props

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info", // default type
  });
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
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
        setProfileImage(
          userData?.avatar ? `${API_BASE_URL}${userData.avatar}` : null
        );
        setisUserEmail(userData?.email || "");
        setEditUsername(userData?.username || ""); // Initialize edit username
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    getUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageClick = () => {
    setIsImageEditMode(true);
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  const handleSaveClick = async () => {
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("username", editUsername);
      formData.append("email", user.email);
      if (selectedImageFile) {
        formData.append("avatar", selectedImageFile);
      }

      // Only append password data if a new password has been entered
      if (newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
        formData.append("confirmNewPassword", confirmNewPassword);
      }

      const response = await updateUserProfile(formData);
      if (response.success) {
        setUser(response.user);
        setProfileImage(`${API_BASE_URL}${response.user.avatar}`);
        setIsImageEditMode(false);
        showToast("Profile updated successfully!", "success");

        setSelectedImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        showToast(
          `Failed to update profile: ${
            response.message || "Something went wrong"
          }`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(`Failed to update profile.`, "error");
    }
  };
  const handleUsernameChange = (e) => {
    setEditUsername(e.target.value);
    console.log("editUsername:", editUsername);
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  return (
    <div className="p-4 md:p-8">
      {toast.open && <CustomToast message={toast.message} type={toast.type} />}
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Profile</h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-12">
            <div className="relative group">
              <img
                src={
                  profileImage
                    ? `${profileImage}`
                    : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                onClick={handleEditImageClick}
                className="absolute bottom-0 right-0 cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
              >
                <Pencil size={16} className="text-gray-600" />
              </button>
              {isImageEditMode && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translateY(100%)",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*" // Only allow image files
                    className="w-32 text-xs"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editUsername ? editUsername : "Loading..."}
              </h2>
              <p className="text-gray-500">{user ? user.role : "User Role"}</p>
            </div>
          </div>

          {/* Password Section (rest of your password update form) */}
          <div className="max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Update Profile
            </h3>
            <p className="text-gray-500 mb-8">
              Please enter your current password to change your password.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  User Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full disabled:opacity-75 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl transition-all"
                    placeholder=""
                    disabled="true"
                    value={isUserEmail}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  User Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                    placeholder=""
                    value={editUsername}
                    onChange={handleUsernameChange}
                  />
                </div>
              </div>
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveClick} // Attach handleSaveClick to this button
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Save Changes {/* Changed the button text */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
