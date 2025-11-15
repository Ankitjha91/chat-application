import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdAdminPanelSettings, MdClose } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const AdminAccessButton = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.userReducer);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Show button only if user role is admin
  if (userProfile?.role !== "admin") return null;

  const handleNavigate = () => {
    navigate("/admin/login");
  };

  const handleDashboard = () => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };

  const handleUserManagement = () => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/users");
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute top-0 right-0 bg-base-200 rounded-2xl shadow-2xl border-2 border-warning/30 p-4 mb-2 w-64 transition-all duration-300 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-warning text-xl" />
              <h3 className="font-bold text-base-content">Admin Panel</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDashboard}
              className="btn btn-warning btn-block justify-start transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105"
            >
              <MdAdminPanelSettings className="text-xl" />
              Dashboard
            </button>
            <button
              onClick={handleUserManagement}
              className="btn btn-primary btn-block justify-start transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105"
            >
              <MdAdminPanelSettings className="text-xl" />
              User Management
            </button>
            <button
              onClick={handleNavigate}
              className="btn btn-outline btn-block justify-start transition-all duration-300 hover:scale-105"
            >
              <FaShieldAlt />
              Admin Login
            </button>
          </div>

          <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/30">
            <p className="text-xs text-base-content/70 flex items-center gap-2">
              <FaShieldAlt className="text-warning" />
              <span>Admin Access Granted</span>
            </p>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`btn btn-warning gap-2 shadow-xl transition-all duration-300 ${
          isExpanded 
            ? "btn-circle w-14 h-14" 
            : isHovered 
            ? "px-6" 
            : "btn-circle w-14 h-14"
        } hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-110 animate-pulse-slow`}
        title="Admin Panel Access"
      >
        <MdAdminPanelSettings className="text-2xl" />
        {isHovered && !isExpanded && (
          <span className="whitespace-nowrap font-semibold animate-fade-in">
            Admin
          </span>
        )}
      </button>

      {/* Badge indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-base-100 animate-ping"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-base-100"></div>

      {/* Custom animations */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminAccessButton;