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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/admin/dashboard-stats");
        const data = response.data.data;

        setStats(data);

        // 🔹 Recent users for Bar Chart
        const formattedRecent = data.recentUsers.map((user) => ({
          name: user.username,
          joined: new Date(user.createdAt).toLocaleDateString(),
        }));
        setChartData(formattedRecent.reverse());

        // 🔹 Monthly user growth (mocked for now)
        const mockMonthly = [
          { month: "Jan", users: 5 },
          { month: "Feb", users: 10 },
          { month: "Mar", users: 15 },
          { month: "Apr", users: 8 },
          { month: "May", users: 12 },
          { month: "Jun", users: 20 },
        ];
        setMonthlyData(mockMonthly);

        // 🔹 Active vs Blocked pie data
        setPieData([
          { name: "Active Users", value: data.activeUsers },
          { name: "Blocked Users", value: data.blockedUsers },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Admin Dashboard</h1>

  <div className="flex gap-3">
    <button
      onClick={() => navigate("/admin/users")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
    >
      Go to User Management
    </button>

    <button
      onClick={() => navigate("/")}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
    >
      Logout
    </button>
  </div>
</div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-700 rounded-2xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-red-700 rounded-2xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold">Blocked Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.blockedUsers}</p>
        </div>

        <div className="bg-green-700 rounded-2xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold">Active Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
        </div>

        <div className="bg-yellow-700 rounded-2xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold">Admins</h2>
          <p className="text-3xl font-bold mt-2">{stats.adminCount}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 📈 Monthly Growth (Line Chart) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">📈 Monthly User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Line type="monotone" dataKey="users" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🧩 Active vs Blocked (Pie Chart) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">🧩 Active vs Blocked Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Recently Joined Users */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">📊 Recently Joined Users</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                color: "#fff",
              }}
            />
            <Bar dataKey="joined" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
