import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstanceAdmin } from "../../components/utilities/axiosInstanceAdmin";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // ✅ Input change handler
  const handleInputChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Admin Login Handler
  const handleLogin = async () => {
    try {
      const response = await axiosInstanceAdmin.post("/admin/login", loginData);

      if (response?.data?.token) {
        // ✅ Save admin token
        localStorage.setItem("adminToken", response.data.token);

        alert("✅ Admin Login Successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[40rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>

        <label className="input input-bordered flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            name="username"
            className="grow"
            placeholder="Admin Username"
            onChange={handleInputChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <IoKeySharp />
          <input
            type="password"
            name="password"
            className="grow"
            placeholder="Admin Password"
            onChange={handleInputChange}
          />
        </label>

        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>

        {/* <p className="text-center">
          Go back to &nbsp;
          <Link to="/login" className="text-blue-400 underline">
            User Login
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default AdminLogin;
