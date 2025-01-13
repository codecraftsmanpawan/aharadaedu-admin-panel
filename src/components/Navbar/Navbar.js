import React, { useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaKey,
  FaRegClipboard,
  FaClipboardList,
  FaRegComment,
  FaUsersCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Toggle profile dropdown menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("AharadaadminauthToken");
    window.location.href = "/";
  };

  // Change password functionality
  const handleChangePassword = () => {
    alert("Change Password clicked");
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

      {/* Center: Navigation Links with Icons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/admin/admission-leads"
          className="flex items-center space-x-2 hover:text-gray-300 text-base font-medium transition-colors"
        >
          <FaRegClipboard size={20} />
          <span>Admission Leads</span>
        </Link>
        <Link
          to="/admin/enquiries"
          className="flex items-center space-x-2 hover:text-gray-300 text-base font-medium transition-colors"
        >
          <FaClipboardList size={20} />
          <span>Enquiries</span>
        </Link>
        <Link
          to="/admin/complaints"
          className="flex items-center space-x-2 hover:text-gray-300 text-base font-medium transition-colors"
        >
          <FaRegComment size={20} />
          <span>Complaints</span>
        </Link>
        <Link
          to="/admin/applied-instructors"
          className="flex items-center space-x-2 hover:text-gray-300 text-base font-medium transition-colors"
        >
          <FaUsersCog size={20} />
          <span>Applied Instructors</span>
        </Link>
      </div>

      {/* Right side: Profile */}
      <div className="flex items-center space-x-4">
        {/* Welcome Message */}
        <span className="text-sm">Welcome, Admin</span>

        {/* Profile Icon */}
        <div className="relative">
          <button onClick={toggleProfileMenu} className="text-white">
            <FaUserCircle size={30} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black p-2 shadow-md rounded-md">
              <ul>
                <li
                  className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleChangePassword}
                >
                  <FaKey />
                  <span>Change Password</span>
                </li>
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
