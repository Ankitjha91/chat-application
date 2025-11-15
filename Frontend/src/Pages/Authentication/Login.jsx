import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../../Store/Slice/user/user.thunk";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.userReducer);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!loginData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await dispatch(loginUserThunk(loginData));
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      <div className="max-w-md w-full">
        <div className="bg-base-200 p-8 rounded-2xl shadow-2xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-primary/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">Welcome Back</h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.username ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <FaUser className="text-base-content/40" />
                <input
                  type="text"
                  name="username"
                  className="grow"
                  placeholder="Enter your username"
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
                <span className="label-text font-medium">Password</span>
              </label>
              <label className={`input input-bordered flex items-center gap-3 ${formErrors.password ? "input-error" : "focus-within:input-primary"} transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                <IoKeySharp className="text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Sign Up Link */}
          <p className="text-center text-base-content/70">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold transition-all duration-200 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;