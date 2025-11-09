import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../components/utilities/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Block / Unblock user (UI instant + DB update)
  const handleBlockUnblock = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.patch(
        `/admin/users/${id}/toggle-block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Show message from backend
      toast.success(response.data.message || "Status updated ✅");

      // ✅ Instantly update UI (no reload needed)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update block status ❌");
    }
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axiosInstance.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted ✅");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user ❌");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;

  return (
    <div className="p-6">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        User Management
      </h2>

      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user._id}
                className="text-center hover:bg-gray-50 transition"
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.isBlocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleBlockUnblock(user._id)}
                    className={`px-4 py-1 rounded text-white ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No users found ❗
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
