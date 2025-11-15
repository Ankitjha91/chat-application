import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstanceAdmin } from "../../components/utilities/axiosInstanceAdmin";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  // Check if admin is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!loginData.username.trim()) {
      errors.username = "Username is required";
    } else if (loginData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Admin Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstanceAdmin.post("/admin/login", loginData);

      if (response?.data?.token) {
        // Save admin token
        localStorage.setItem("adminToken", response.data.token);

        toast.success("Admin Login Successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      <div className="max-w-md w-full">
        <div className="bg-base-200 p-8 rounded-2xl shadow-2xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:border-warning/50">

          {/* Header with Admin Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-warning/10 rounded-full mb-4 border-4 border-warning/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              <MdAdminPanelSettings className="text-5xl text-warning" />
            </div>
            <h2 className="text-3xl font-bold text-base-content flex items-center justify-center gap-2">
              <FaShieldAlt className="text-warning" />
              Admin Portal
            </h2>
            <p className="text-base-content/60 mt-2">Secure administrative access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Admin Username</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.username ? "input-error" : "focus-within:input-warning"
                } transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]`}>
                <FaUser className="text-base-content/40" />
                <input
                  type="text"
                  name="username"
                  className="grow"
                  placeholder="Enter admin username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </label>
              {formErrors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.username}</span>
                </label>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Admin Password</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.password ? "input-error" : "focus-within:input-warning"
                } transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]`}>
                <IoKeySharp className="text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter admin password"
                  className="grow"
                  value={loginData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-base-content/40 hover:text-base-content transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>
              {formErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.password}</span>
                </label>
              )}
            </div>

            {/* Security Notice */}
            <div className="alert alert-warning/20 border border-warning/30">
              <FaShieldAlt className="text-warning" />
              <span className="text-sm">This is a secure admin-only area</span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-warning w-full text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <MdAdminPanelSettings className="text-xl" />
                  Admin Login
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              type="button"
              className="btn btn-error transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 flex items-center justify-center gap-2 w-full"
            >
              Go to User Site
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;