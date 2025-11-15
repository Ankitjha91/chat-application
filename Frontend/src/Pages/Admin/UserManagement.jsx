import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../components/utilities/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdBlock,
  MdCheckCircle,
  MdDelete,
  MdSearch,
  MdRefresh,
  MdPeople,
} from "react-icons/md";
import { FaUserShield } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, blocked
  const navigate = useNavigate();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Please login as admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.users || response.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
      toast.success("Users loaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load users");
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  useEffect(() => {
    let filtered = users;

    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((user) => !user.isBlocked);
    } else if (filterStatus === "blocked") {
      filtered = filtered.filter((user) => user.isBlocked);
    }

    // Search by username or email
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterStatus, users]);

  // Block / Unblock user
  const handleBlockUnblock = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.patch(
        `/admin/users/${id}/toggle-block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        response.data.message || `User ${currentStatus ? "unblocked" : "blocked"} successfully`
      );

      // Update UI instantly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update block status");
    }
  };

  // Delete user with confirmation
  const handleDelete = async (id, username) => {
    // Custom confirmation modal would be better, but using native for now
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "${username}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axiosInstance.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`User "${username}" deleted successfully`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-warning"></span>
          <p className="mt-4 text-base-content/60">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-xl border-2 border-warning/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              <MdPeople className="text-3xl text-warning" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-base-content">User Management</h2>
              <p className="text-base-content/60">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="btn btn-outline btn-warning transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              disabled={loading}
            >
              <MdRefresh className="text-xl" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn btn-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <MdArrowBack className="text-xl" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-base-200 p-6 rounded-2xl shadow-xl border border-base-300 mb-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="input input-bordered flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus-within:input-primary">
                <MdSearch className="text-xl text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by username, email, or name..."
                  className="grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-base-content/40 hover:text-error transition-colors"
                  >
                    ✕
                  </button>
                )}
              </label>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`btn ${
                  filterStatus === "all" ? "btn-primary" : "btn-outline"
                } transition-all duration-300`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`btn ${
                  filterStatus === "active" ? "btn-success" : "btn-outline"
                } transition-all duration-300`}
              >
                Active ({users.filter((u) => !u.isBlocked).length})
              </button>
              <button
                onClick={() => setFilterStatus("blocked")}
                className={`btn ${
                  filterStatus === "blocked" ? "btn-error" : "btn-outline"
                } transition-all duration-300`}
              >
                Blocked ({users.filter((u) => u.isBlocked).length})
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-base-200 rounded-2xl shadow-xl border border-base-300 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="text-center">#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-base-300 transition-colors duration-200"
                    >
                      <td className="text-center font-semibold">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img
                                src={
                                  user.avatar?.startsWith("http")
                                    ? user.avatar
                                    : `${import.meta.env.VITE_DB_ORIGIN}${user.avatar}`
                                }
                                alt={user.username}
                                onError={(e) => {
                                  e.target.src = "/default-avatar.png";
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.username}</div>
                            {user.role === "admin" && (
                              <div className="badge badge-warning badge-sm gap-1">
                                <FaUserShield />
                                Admin
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-base-content/70">{user.email || "N/A"}</td>
                      <td className="text-base-content/70">{user.fullName || "N/A"}</td>
                      <td className="text-center">
                        {user.isBlocked ? (
                          <div className="badge badge-error gap-2">
                            <MdBlock />
                            Blocked
                          </div>
                        ) : (
                          <div className="badge badge-success gap-2">
                            <MdCheckCircle />
                            Active
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                            className={`btn btn-sm ${
                              user.isBlocked ? "btn-success" : "btn-error"
                            } transition-all duration-300 hover:scale-110`}
                            title={user.isBlocked ? "Unblock user" : "Block user"}
                          >
                            <MdBlock />
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.username)}
                            className="btn btn-sm btn-outline btn-error transition-all duration-300 hover:scale-110"
                            title="Delete user"
                          >
                            <MdDelete />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <div className="flex flex-col items-center gap-3 text-base-content/60">
                        <MdPeople className="text-5xl" />
                        <p className="text-lg">
                          {searchTerm || filterStatus !== "all"
                            ? "No users found matching your filters"
                            : "No users available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;