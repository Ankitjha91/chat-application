import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  MdDashboard,
  MdPeople,
  MdBlock,
  MdCheckCircle,
  MdAdminPanelSettings,
  MdLogout,
  MdManageAccounts,
} from "react-icons/md";
import { HiTrendingUp } from "react-icons/hi";
import toast from "react-hot-toast";

const COLORS = ["#22c55e", "#ef4444"]; // Green (Active) | Red (Blocked)

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    activeUsers: 0,
    adminCount: 0,
    recentUsers: [],
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Please login as admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/admin/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const data = response.data.data;

        setStats(data);

        // Recent users for Bar Chart
        const formattedRecent = data.recentUsers.map((user) => ({
          name: user.username,
          count: 1,
          date: new Date(user.createdAt).toLocaleDateString(),
        }));
        setChartData(formattedRecent.reverse());

        // Monthly user growth (mock data)
        const mockMonthly = [
          { month: "Jan", users: 5 },
          { month: "Feb", users: 10 },
          { month: "Mar", users: 15 },
          { month: "Apr", users: 8 },
          { month: "May", users: 12 },
          { month: "Jun", users: 20 },
        ];
        setMonthlyData(mockMonthly);

        // Active vs Blocked pie data
        setPieData([
          { name: "Active Users", value: data.activeUsers },
          { name: "Blocked Users", value: data.blockedUsers },
        ]);

        toast.success("Dashboard loaded successfully");
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard data");
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-warning"></span>
          <p className="mt-4 text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-xl border-2 border-warning/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              <MdDashboard className="text-3xl text-warning" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
              <p className="text-base-content/60">Overview and Analytics</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/users")}
              className="btn btn-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105"
            >
              <MdManageAccounts className="text-xl" />
              User Management
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-error transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105"
            >
              <MdLogout className="text-xl" />
              Logout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 hover:border-primary/50">
            <div className="flex items-center justify-between mb-4">
              <MdPeople className="text-4xl text-primary" />
              <div className="badge badge-primary badge-lg">Total</div>
            </div>
            <h2 className="text-lg font-semibold text-base-content/70">Total Users</h2>
            <p className="text-4xl font-bold text-base-content mt-2">{stats.totalUsers}</p>
            <div className="flex items-center gap-2 mt-3 text-success text-sm">
              <HiTrendingUp />
              <span>All registered users</span>
            </div>
          </div>

          {/* Blocked Users Card */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-105 hover:border-error/50">
            <div className="flex items-center justify-between mb-4">
              <MdBlock className="text-4xl text-error" />
              <div className="badge badge-error badge-lg">Blocked</div>
            </div>
            <h2 className="text-lg font-semibold text-base-content/70">Blocked Users</h2>
            <p className="text-4xl font-bold text-base-content mt-2">{stats.blockedUsers}</p>
            <div className="flex items-center gap-2 mt-3 text-error text-sm">
              <MdBlock />
              <span>Restricted accounts</span>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 hover:border-success/50">
            <div className="flex items-center justify-between mb-4">
              <MdCheckCircle className="text-4xl text-success" />
              <div className="badge badge-success badge-lg">Active</div>
            </div>
            <h2 className="text-lg font-semibold text-base-content/70">Active Users</h2>
            <p className="text-4xl font-bold text-base-content mt-2">{stats.activeUsers}</p>
            <div className="flex items-center gap-2 mt-3 text-success text-sm">
              <MdCheckCircle />
              <span>Currently active</span>
            </div>
          </div>

          {/* Admins Card */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 hover:border-warning/50">
            <div className="flex items-center justify-between mb-4">
              <MdAdminPanelSettings className="text-4xl text-warning" />
              <div className="badge badge-warning badge-lg">Admin</div>
            </div>
            <h2 className="text-lg font-semibold text-base-content/70">Administrators</h2>
            <p className="text-4xl font-bold text-base-content mt-2">{stats.adminCount}</p>
            <div className="flex items-center gap-2 mt-3 text-warning text-sm">
              <MdAdminPanelSettings />
              <span>Admin accounts</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Growth Chart */}
          <div className="bg-base-200 p-6 rounded-2xl shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-base-content">
              📈 Monthly User Growth
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--b2))",
                    color: "hsl(var(--bc))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-base-200 p-6 rounded-2xl shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-base-content">
              🧩 Active vs Blocked Users
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--b2))",
                    color: "hsl(var(--bc))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users Bar Chart */}
        <div className="bg-base-200 p-6 rounded-2xl shadow-xl border border-base-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-base-content">
            📊 Recently Joined Users
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--b2))",
                  color: "hsl(var(--bc))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;