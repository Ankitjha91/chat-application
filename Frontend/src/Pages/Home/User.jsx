import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../Store/Slice/user/user.slice";


function User({ userDetails }) {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  const isUserOnline = onlineUsers?.includes(userDetails?._id);
  const handleSelectUser = () => dispatch(setSelectedUser(userDetails));
  
  const avatarUrl =
    userDetails?.avatar?.startsWith("http")
      ? userDetails.avatar
      : `${import.meta.env.VITE_DB_ORIGIN}${
          userDetails?.avatar || "/default-avatar.png"
        }`;

  return (
    <div
      onClick={handleSelectUser}
      className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        selectedUser?._id === userDetails?._id
          ? "bg-gray-700"
          : "hover:bg-gray-700"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
          isUserOnline ? "border-green-500" : "border-gray-600"
        }`}
      >
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-white font-medium line-clamp-1">
          {userDetails?.fullName || "Unknown User"}
        </h1>
        <p className="text-xs text-gray-400 line-clamp-1">
          {userDetails?.username || ""}
        </p>
      </div>
    </div>
  );
}

export default User;
