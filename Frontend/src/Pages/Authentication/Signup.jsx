import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../Store/Slice/user/user.thunk";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.userReducer);
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!signupData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (signupData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters";
    }

    if (!signupData.username.trim()) {
      errors.username = "Username is required";
    } else if (signupData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!signupData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Password and confirm password do not match");
    }
    
    const response = await dispatch(registerUserThunk(signupData));
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup(e);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      <div className="max-w-md w-full">
        <div className="bg-base-200 p-8 rounded-2xl shadow-2xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-primary/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">Create Account</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.fullName ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <FaUser className="text-base-content/40" />
                <input
                  type="text"
                  name="fullName"
                  className="grow"
                  placeholder="Enter your full name"
                  value={signupData.fullName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </label>
              {formErrors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.fullName}</span>
                </label>
              )}
            </div>

            {/* Username Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.username ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <MdEmail className="text-base-content/40" />
                <input
                  type="text"
                  name="username"
                  className="grow"
                  placeholder="Choose a username"
                  value={signupData.username}
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
                <span className="label-text font-medium">Password</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.password ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <IoKeySharp className="text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  className="grow"
                  value={signupData.password}
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

            {/* Confirm Password Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.confirmPassword ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <IoKeySharp className="text-base-content/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="grow"
                  value={signupData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-base-content/40 hover:text-base-content transition-colors"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>
              {formErrors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.confirmPassword}</span>
                </label>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Gender</span>
              </label>
              <div className="flex items-center gap-6 p-4 bg-base-300 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <label className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={signupData.gender === "male"}
                    onChange={handleInputChange}
                    className="radio radio-primary"
                    disabled={loading}
                  />
                  <span className="label-text">Male</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={signupData.gender === "female"}
                    onChange={handleInputChange}
                    className="radio radio-primary"
                    disabled={loading}
                  />
                  <span className="label-text">Female</span>
                </label>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="btn btn-primary w-full text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Login Link */}
          <p className="text-center text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold transition-all duration-200 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;