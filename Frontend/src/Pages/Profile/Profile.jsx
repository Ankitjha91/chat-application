import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfileThunk } from "../../Store/Slice/user/user.thunk";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../components/utilities/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";
import { IoKeySharp } from "react-icons/io5";
import { BsGenderAmbiguous } from "react-icons/bs";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, loading } = useSelector((state) => state.userReducer);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    status: "",
    gender: "male",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Set initial user data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || "",
        username: userProfile.username || "",
        password: "",
        confirmPassword: "",
        bio: userProfile.bio || "",
        status: userProfile.status || "",
        gender: userProfile.gender || "male",
        avatar: null,
      });

      if (userProfile.avatar?.startsWith("http")) {
        setPreview(userProfile.avatar);
      } else if (userProfile.avatar) {
        setPreview(`${import.meta.env.VITE_DB_ORIGIN}${userProfile.avatar}?t=${Date.now()}`);
      } else {
        setPreview(null);
      }
    }
  }, [userProfile]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (formData.password && formData.password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        bio: formData.bio,
        status: formData.status,
        gender: formData.gender,
        avatar: formData.avatar,
      };

      await dispatch(updateUserProfileThunk(updatedData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // Redirect to home page after update
      navigate("/");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    // Reset form data to original profile
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || "",
        username: userProfile.username || "",
        password: "",
        confirmPassword: "",
        bio: userProfile.bio || "",
        status: userProfile.status || "",
        gender: userProfile.gender || "male",
        avatar: null,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-300 to-base-100">
      <div className="bg-base-200 shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-primary/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-base-content">
            {isEditing ? "Edit Profile" : "Your Profile"}
          </h2>
          <p className="text-base-content/60 mt-2">
            {isEditing ? "Update your information" : "View your profile details"}
          </p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <img
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-primary-content p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <FaCamera className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-base-content/60 mt-3">
              Click the camera icon to upload a new photo
            </p>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <label className={`input input-bordered flex items-center gap-3 ${
              formErrors.fullName ? "input-error" : isEditing ? "focus-within:input-primary" : ""
            } transition-all duration-300 ${isEditing ? "hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" : ""}`}>
              <FaUser className="text-base-content/40" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className="grow"
              />
            </label>
            {formErrors.fullName && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.fullName}</span>
              </label>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Username</span>
            </label>
            <label className={`input input-bordered flex items-center gap-3 ${
              formErrors.username ? "input-error" : isEditing ? "focus-within:input-primary" : ""
            } transition-all duration-300 ${isEditing ? "hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" : ""}`}>
              <MdEmail className="text-base-content/40" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your username"
                className="grow"
              />
            </label>
            {formErrors.username && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.username}</span>
              </label>
            )}
          </div>

          {/* Password Fields - Only show when editing */}
          {isEditing && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-medium">New Password (Optional)</span>
                </label>
                <label className={`input input-bordered flex items-center gap-3 ${
                  formErrors.password ? "input-error" : "focus-within:input-primary"
                } transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                  <IoKeySharp className="text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="grow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-base-content/40 hover:text-base-content transition-colors"
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

              <div>
                <label className="label">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <label className={`input input-bordered flex items-center gap-3 ${
                  formErrors.confirmPassword ? "input-error" : "focus-within:input-primary"
                } transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                  <IoKeySharp className="text-base-content/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="grow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-base-content/40 hover:text-base-content transition-colors"
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
            </>
          )}

          {/* Gender */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Gender</span>
            </label>
            <label className={`select select-bordered flex items-center gap-3 w-full ${
              isEditing ? "focus-within:select-primary" : ""
            } transition-all duration-300 ${isEditing ? "hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" : ""}`}>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* Bio */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Bio</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
              placeholder="Tell us about yourself..."
              className={`textarea textarea-bordered w-full ${
                isEditing ? "focus:textarea-primary" : ""
              } transition-all duration-300 ${isEditing ? "hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" : ""}`}
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-outline flex-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary flex-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary w-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <MdEdit className="text-lg" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;