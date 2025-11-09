import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminAccessButton = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.userReducer);

  // Show button only if user role is admin
  if (userProfile?.role !== "admin") return null;

  return (
    <div className="absolute top-4 right-6 z-50">
      <button
        onClick={() => navigate("/admin/login")}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-md transition duration-200"
      >
        Go to Admin Panel
      </button>
    </div>
  );
};

export default AdminAccessButton;
