import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../Store/Slice/user/user.slice";

function User({ userDetails }) {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  
  // Check if user is online
  const isUserOnline = onlineUsers?.includes(userDetails?._id);
  
  // Check if this user is currently selected
  const isSelected = selectedUser?._id === userDetails?._id;
  
  // Handle user selection
  const handleSelectUser = () => {
    if (userDetails) {
      dispatch(setSelectedUser(userDetails));
    }
  };
  
  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (!userDetails?.avatar) {
      return "/default-avatar.png";
    }
    return userDetails.avatar.startsWith("http")
      ? userDetails.avatar
      : `${import.meta.env.VITE_DB_ORIGIN}${userDetails.avatar}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/default-avatar.png";
  };

  // Don't render if no user details
  if (!userDetails) {
    return null;
  }

  return (
    <div
      onClick={handleSelectUser}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleSelectUser()}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 group ${
        isSelected
          ? "bg-primary/20 border-l-4 border-primary shadow-lg"
          : "hover:bg-base-100 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      }`}
    >
      {/* Avatar with Online Status */}
      <div className="relative">
        <div
          className={`avatar ${isUserOnline ? "online" : "offline"} transition-all duration-300 group-hover:scale-110`}
        >
          <div className={`w-12 h-12 rounded-full ring ring-offset-base-100 ring-offset-2 ${
            isUserOnline ? "ring-success" : "ring-base-300"
          }`}>
            <img
              src={getAvatarUrl()}
              alt={`${userDetails.fullName || 'User'} Avatar`}
              className="object-cover"
              onError={handleImageError}
            />
          </div>
        </div>
        
        {/* Online Indicator Badge */}
        {isUserOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-200 animate-pulse"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base-content font-semibold truncate transition-colors duration-200 group-hover:text-primary">
          {userDetails.fullName || "Unknown User"}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-base-content/60 truncate">
            @{userDetails.username || "username"}
          </p>
          {isUserOnline && (
            <span className="badge badge-success badge-xs">Online</span>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default User;