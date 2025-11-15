import React, { useEffect, useState } from 'react';
import { IoSearch, IoLogOutOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import User from './User';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserThunk, getOtherUsersThunk } from '../../Store/Slice/user/user.thunk';
import { Link } from "react-router-dom";

const UserSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dispatch = useDispatch();
  const { otherUsers, userProfile, loading } = useSelector((state) => state.userReducer);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUserThunk());
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Filter users based on search
  useEffect(() => {
    // Handle null or undefined otherUsers
    if (!otherUsers || !Array.isArray(otherUsers)) {
      setUsers([]);
      return;
    }

    if (!searchValue.trim()) {
      setUsers(otherUsers);
    } else {
      const filteredUsers = otherUsers.filter((user) => {
        if (!user) return false;
        const searchLower = searchValue.toLowerCase();
        return (
          user.username?.toLowerCase().includes(searchLower) ||
          user.fullName?.toLowerCase().includes(searchLower)
        );
      });
      setUsers(filteredUsers);
    }
  }, [searchValue, otherUsers]);

  // Fetch other users on mount
  useEffect(() => {
    dispatch(getOtherUsersThunk());
  }, [dispatch]);

  return (
    <div className="max-w-[20em] w-full h-screen flex flex-col border-r border-base-300 bg-base-200">
      
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3 mb-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] p-3 rounded-lg">
          <BiMessageSquareDetail className="text-primary text-2xl" />
          <h1 className="text-2xl font-bold text-primary">Chats</h1>
        </div>

        {/* Search Bar */}
        <label className="input input-bordered flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus-within:input-primary">
          <IoSearch className="text-base-content/40 text-xl" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="grow"
            placeholder="Search users..."
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="text-base-content/40 hover:text-error transition-colors text-sm font-semibold"
            >
              Clear
            </button>
          )}
        </label>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : users && users.length > 0 ? (
          users.map((userDetails) => (
            <User key={userDetails?._id} userDetails={userDetails} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-base-content/60">
            <FaUserCircle className="text-6xl mb-4" />
            <p className="text-center">
              {searchValue ? "No users found" : "No users available"}
            </p>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-base-300 p-4 bg-base-300">
        <div className="flex items-center justify-between gap-3">
          {/* Profile Link */}
          <Link
            to="/profile"
            className="flex items-center gap-3 flex-1 hover:bg-base-100 p-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] group"
          >
            <div className="avatar online">
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-300 group-hover:ring-secondary">
                <img
                  src={
                    userProfile?.avatar?.startsWith("http")
                      ? userProfile.avatar
                      : userProfile?.avatar
                      ? `${import.meta.env.VITE_DB_ORIGIN}${userProfile.avatar}`
                      : "/default-avatar.png"
                  }
                  alt="User Avatar"
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base-content font-semibold truncate">
                {userProfile?.fullName || "User"}
              </h2>
              <p className="text-base-content/60 text-sm truncate">
                @{userProfile?.username || "username"}
              </p>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn btn-error btn-sm px-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105"
            title="Logout"
          >
            {isLoggingOut ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <IoLogOutOutline className="text-lg" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UserSidebar;