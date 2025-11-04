import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // ✅ Helper function to get full image URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png"; // optional placeholder
    return avatar.startsWith("http")
      ? avatar
      : `${import.meta.env.VITE_DB_ORIGIN}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
  };

  // ✅ Determine which avatar to show
  const currentAvatar =
    userProfile?._id === messageDetails?.sender
      ? getAvatarUrl(userProfile?.avatar)
      : getAvatarUrl(selectedUser?.avatar);

  return (
    <div
      ref={messageRef}
      className={`chat ${
        userProfile?._id === messageDetails?.sender
          ? "chat-end"
          : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src={currentAvatar}
            alt="User Avatar"
            className="object-cover w-10 h-10"
          />
        </div>
      </div>

      <div className="chat-header">
        <time className="text-xs opacity-50">12:45</time>
      </div>

      <div className="chat-bubble">{messageDetails?.message}</div>
    </div>
  );
};

export default Message;
