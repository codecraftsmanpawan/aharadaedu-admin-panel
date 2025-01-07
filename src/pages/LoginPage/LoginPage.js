import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import base_url from "../../config";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = credentials;
    try {
      const data = JSON.stringify({
        username,
        password,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${base_url}/api/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.success) {
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Save the token to localStorage
        localStorage.setItem("AharadaadminauthToken", response.data.token);

        setTimeout(() => {
          navigate("/admin");
        }, 3000);
      } else {
        toast.error("Invalid username or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Error logging in. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: "linear-gradient(rgb(253, 251, 249), rgb(244, 235, 221))",
      }}
    >
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow:
            "0 8px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.2)",
          transform: "translateZ(0)",
          background: "linear-gradient(rgb(253, 251, 249), rgb(229, 226, 222))",
        }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">
          Admin Panel Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500"
              required
              style={{
                boxShadow:
                  "inset 0 4px 8px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.15)",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500"
              required
              style={{
                boxShadow:
                  "inset 0 4px 8px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.15)",
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-gray-800 hover:bg-gray-600 rounded-md shadow-md focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none"
            style={{
              boxShadow:
                "0 6px 12px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Login
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
