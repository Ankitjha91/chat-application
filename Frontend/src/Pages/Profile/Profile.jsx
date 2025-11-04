import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfileThunk } from "../../Store/Slice/user/user.thunk";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../components/utilities/axiosInstance";

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile, loading } = useSelector((state) => state.userReducer);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    status: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Set initial user data
 useEffect(() => {
  if (userProfile) {
    setFormData({
      fullName: userProfile.fullName || "",
      bio: userProfile.bio || "",
      status: userProfile.status || "",
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
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  // Handle profile update
  const handleSave = async () => {
    try {
      const updatedData = {
        fullName: formData.fullName,
        bio: formData.bio,
        status: formData.status,
        avatar: formData.avatar,
      };

      await dispatch(updateUserProfileThunk(updatedData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          {isEditing ? "Edit Profile" : "Your Profile"}
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={preview || "/default-avatar.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full border object-cover"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-sm"
            />
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded-md focus:outline-none ${isEditing
                  ? "bg-white text-black border-blue-400"
                  : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded-md focus:outline-none ${isEditing
                  ? "bg-white text-black border-blue-400"
                  : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              className={`w-full mt-1 p-2 border rounded-md focus:outline-none ${isEditing
                  ? "bg-white text-black border-blue-400"
                  : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
