import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../Store/Slice/user/user.slice';

function User({ userDetails }) {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  const isUserOnline = onlineUsers?.includes(userDetails?._id);

  const handleSelectUser = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <div
      onClick={handleSelectUser}
      className={`flex gap-5 items-center hover:bg-gray-600 cursor-pointer rounded-lg p-3 px-2 py-1 
        ${selectedUser?._id === userDetails?._id ? 'bg-gray-600' : ''}`}
    >
      <div className={`avatar ${isUserOnline ? 'avatar-online' : 'avatar-offline'}`}>
        <div className="w-12 rounded-full overflow-hidden">
          <img
            src={
              userDetails?.avatar?.startsWith("http")
                ? userDetails.avatar
                : `${import.meta.env.VITE_DB_ORIGIN}${userDetails?.avatar}`
            }
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>
      <div>
        <h1 className="line-clamp-1 text-white font-medium">{userDetails?.fullName}</h1>
        <p className="text-xs text-gray-300">{userDetails?.username}</p>
      </div>
    </div>
  );
}

export default User;
