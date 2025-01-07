import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUniversity } from "react-icons/fa";
import base_url from "../config";
const Login = () => {
  // State for form inputs and error handling
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login process
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = JSON.stringify({
      username,
      password,
    });

    const config = {
      method: "post",
      url: `${base_url}/api/university/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("universityloginaradradha", response.data.token);

        // Show success toast
        toast.success("Login successful!");

        window.location.href = "/university/dashboard/admin";
      } else {
        // Show error toast
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      // Show error toast
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center "
      style={{
        background: "linear-gradient(rgb(20,18,88,255), rgb(83, 121, 181))",
      }}
    >
      <div
        className="relative bg-white p-10 rounded-3xl shadow-2xl w-95 z-10 transform transition-transform duration-500 hover:scale-105 hover:shadow-xl"
        style={{ backgroundColor: "#142658" }}
      >
        {/* Logo */}
        {/* <div className="flex justify-center mb-4">
          <FaUniversity className="text-6xl text-blue-600" />
        </div> */}

        <div className="text-center">
          <img
            src="https://www.aharadaedu.in/whf.png"
            alt="Admin Panel Logo"
            className="mx-auto mb-4 w-24 h-24"
          />
          <h2 className="text-3xl font-bold text-gray-100">
            University Login Admin Panel
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4 mt-8">
            <label
              className="block text-sm font-medium text-gray-100"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-100"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 text-black bg-gray-100 rounded ${
              loading ? "bg-gary-200" : "hover:bg-gray-400"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Initialize Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Login;
