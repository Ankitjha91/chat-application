import React, { useEffect, useRef } from 'react';
import User from './User';
import Message from './Message';
import { useSelector, useDispatch } from 'react-redux';
import { getMessageThunk } from '../../Store/Slice/message/message.thunk';
import SendMessage from './SendMessage';
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser, userProfile } = useSelector((state) => state.userReducer);
  const { messages, loading } = useSelector((state) => state.messageReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Check if selected user is online
  const isUserOnline = onlineUsers?.includes(selectedUser?._id);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ receiverId: selectedUser._id }));
    }
  }, [selectedUser, dispatch]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Welcome screen when no user is selected
  const WelcomeScreen = () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-100">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-110">
          <HiOutlineChatBubbleLeftRight className="text-6xl text-primary" />
        </div>
        
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Welcome to Chat
        </h2>
        
        <p className="text-lg text-base-content/60 mb-6">
          Select a conversation from the sidebar to start messaging
        </p>

        <div className="bg-base-200 p-6 rounded-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-base-content/70">
              {userProfile?.fullName || 'You'} - Online
            </span>
          </div>
          <p className="text-sm text-base-content/50">
            Your messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );

  // Loading screen
  const LoadingMessages = () => (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-base-content/60">Loading messages...</p>
      </div>
    </div>
  );

  // Empty messages state
  const EmptyMessages = () => (
    <div className="flex flex-col items-center justify-center h-full text-base-content/60 p-8">
      <BiMessageSquareDetail className="text-6xl mb-4 opacity-50" />
      <p className="text-center text-lg">
        No messages yet
      </p>
      <p className="text-center text-sm mt-2">
        Start the conversation by sending a message below
      </p>
    </div>
  );

  // Render when no user is selected
  if (!selectedUser) {
    return <WelcomeScreen />;
  }

  // Main chat interface
  return (
    <div className="h-screen w-full flex flex-col bg-base-100">
      {/* Chat Header */}
      <div className="p-4 border-b border-base-300 bg-base-200 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
        <div className="flex items-center justify-between">
          <User userDetails={selectedUser} />
          
          {/* Online Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isUserOnline ? 'bg-success animate-pulse' : 'bg-base-content/20'
            }`}></div>
            <span className="text-sm text-base-content/60">
              {isUserOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-base-100 to-base-200 custom-scrollbar"
      >
        {loading ? (
          <LoadingMessages />
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((messageDetails, index) => {
              // Check if we need to show date separator
              const showDateSeparator = index === 0 || 
                new Date(messages[index - 1]?.createdAt).toDateString() !== 
                new Date(messageDetails?.createdAt).toDateString();

              return (
                <React.Fragment key={messageDetails?._id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="bg-base-300 px-4 py-1 rounded-full text-xs text-base-content/60">
                        {new Date(messageDetails?.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                  <Message messageDetails={messageDetails} />
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyMessages />
        )}
      </div>

      {/* Send Message Input */}
      <SendMessage />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MessageContainer;