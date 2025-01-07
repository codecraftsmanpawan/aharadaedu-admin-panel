import React, { useState } from "react";
import { FaBell, FaUserCircle, FaSignOutAlt, FaKey } from "react-icons/fa"; // Added icons for sign-out and key

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // To toggle profile menu

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Toggle profile dropdown menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("AharadaadminauthToken"); // Clear auth token
    window.location.href = "/"; // Redirect to login page
  };

  // Change password functionality
  const handleChangePassword = () => {
    alert("Change Password clicked"); // You can replace this with your actual password change logic
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
      {/* Left side: Admin Panel title */}
      <div className="flex items-center">
        <img
          src="https://www.aharadaedu.in/whf.png"
          width={30}
          alt="Logo"
          className="mr-3"
        />
        <h1 className="text-white text-xl font-semibold">Admin Panel</h1>
      </div>
      {/* Right side: Profile and Notifications */}
      <div className="flex items-center space-x-4">
        {/* Welcome Message */}
        <span className="text-sm">Welcome, Admin</span>

        {/* Notifications Icon */}
        <div className="relative">
          <button onClick={toggleNotifications} className="text-white">
            <FaBell size={24} />
            {/* Notification indicator */}
            {showNotifications && (
              <div className="absolute right-0 w-48 mt-2 bg-white text-black p-2 shadow-md rounded-md">
                <ul>
                  <li>New comment on your post</li>
                  <li>User registered</li>
                  <li>New message received</li>
                </ul>
              </div>
            )}
          </button>
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button onClick={toggleProfileMenu} className="text-white">
            <FaUserCircle size={30} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black p-2 shadow-md rounded-md">
              <ul>
                {/* <li
                  className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleChangePassword}
                >
                  <FaKey />
                  <span>Change Password</span>
                </li> */}
                <li
                  className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
