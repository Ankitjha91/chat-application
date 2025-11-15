import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../Store/Slice/message/message.thunk";
import toast from "react-hot-toast";

const SendMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { loading } = useSelector((state) => state.messageReducer);
  
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  // Focus input when user is selected
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  // Handle send message
  const handleSendMessage = async () => {
    // Validation
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!selectedUser?._id) {
      toast.error("Please select a user to send message");
      return;
    }

    setIsSending(true);
    try {
      await dispatch(
        sendMessageThunk({
          receiverId: selectedUser._id,
          message: message.trim(),
        })
      ).unwrap();
      
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Disable send button if no message or no user selected
  const isSendDisabled = !message.trim() || !selectedUser || isSending || loading;

  return (
    <div className="w-full p-4 border-t border-base-300 bg-base-200">
      <div className="flex items-center gap-3">
        {/* Emoji Button (Optional - can add emoji picker later) */}
        <button
          type="button"
          className="btn btn-circle btn-ghost transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-110"
          title="Add emoji"
        >
          <MdEmojiEmotions className="text-2xl text-base-content/60 hover:text-primary transition-colors" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              selectedUser
                ? `Message ${selectedUser.fullName || selectedUser.username}...`
                : "Select a user to start messaging..."
            }
            className="input input-bordered w-full pr-12 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus:input-primary"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!selectedUser || isSending}
            maxLength={1000}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/40">
              {message.length}/1000
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSendDisabled}
          className={`btn btn-circle btn-primary transition-all duration-300 ${
            !isSendDisabled
              ? "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-110"
              : "opacity-50 cursor-not-allowed"
          }`}
          title="Send message (Enter)"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <IoIosSend className="text-2xl" />
          )}
        </button>
      </div>

      {/* Typing indicator space (can be used later) */}
      <div className="h-4 mt-1">
        {/* You can add "User is typing..." indicator here */}
      </div>
    </div>
  );
};

export default SendMessage;