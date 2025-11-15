import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { MdContentCopy, MdDelete } from "react-icons/md";

const Message = ({ messageDetails }) => {
  const { userProfile, selectedUser } = useSelector((state) => state.userReducer);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if message is from current user
  const isOwnMessage = userProfile?._id === messageDetails?.sender;

  // Get avatar URL with fallback
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return avatar.startsWith("http")
      ? avatar
      : `${import.meta.env.VITE_DB_ORIGIN}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
  };

  // Determine which avatar to show
  const currentAvatar = isOwnMessage
    ? getAvatarUrl(userProfile?.avatar)
    : getAvatarUrl(selectedUser?.avatar);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Copy message to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageDetails?.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Handle delete (you can implement delete functionality)
  const handleDelete = () => {
    // Add delete message logic here
    console.log("Delete message:", messageDetails?._id);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/default-avatar.png";
  };

  return (
    <div
      className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-300 group-hover:ring-secondary">
          <img
            src={currentAvatar}
            alt={`${isOwnMessage ? userProfile?.fullName : selectedUser?.fullName} Avatar`}
            className="object-cover"
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Message Header */}
      <div className="chat-header flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-base-content/70">
          {isOwnMessage ? "You" : selectedUser?.fullName || "User"}
        </span>
        <time className="text-xs text-base-content/50">
          {formatTime(messageDetails?.createdAt)}
        </time>
      </div>

      {/* Message Bubble */}
      <div
        className={`chat-bubble relative transition-all duration-300 ${
          isOwnMessage
            ? "bg-primary text-primary-content hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "bg-base-300 text-base-content hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        }`}
      >
        {/* Message Text */}
        <p className="break-words whitespace-pre-wrap">
          {messageDetails?.message}
        </p>

        {/* Message Actions (shown on hover) */}
        {showActions && (
          <div
            className={`absolute -top-8 ${
              isOwnMessage ? "right-0" : "left-0"
            } flex gap-1 bg-base-200 rounded-lg p-1 shadow-lg border border-base-300 animate-fade-in`}
          >
            <button
              onClick={handleCopy}
              className="btn btn-ghost btn-xs transition-all duration-200 hover:scale-110"
              title="Copy message"
            >
              {copied ? (
                <BsCheck2All className="text-success" />
              ) : (
                <MdContentCopy className="text-base-content/60" />
              )}
            </button>
            {isOwnMessage && (
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-xs transition-all duration-200 hover:scale-110"
                title="Delete message"
              >
                <MdDelete className="text-error" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Message Footer (Read Status for own messages) */}
      {isOwnMessage && (
        <div className="chat-footer opacity-50 mt-1 flex items-center gap-1">
          {messageDetails?.isRead ? (
            <>
              <BsCheck2All className="text-info" />
              <span className="text-xs">Read</span>
            </>
          ) : (
            <>
              <BsCheck2 />
              <span className="text-xs">Sent</span>
            </>
          )}
        </div>
      )}

      {/* Custom animation styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Message;