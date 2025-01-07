import React from "react";
import { useNavigate, Link } from "react-router-dom";
const Navbar = ({ universityName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("universityloginaradradha");
    navigate("/university/login/admin");
  };

  const username = "Admin";

  return (
    <nav
      className=" p-4 flex justify-between items-center"
      style={{ backgroundColor: "#072e46" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="https://www.aharadaedu.in/whf.png"
          width={60}
          alt="Logo"
          className="mr-3"
        />
        <h1 className="text-white text-xl font-semibold">Aharada Education</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4">
        <Link
          to="/university/dashboard/admin"
          className="text-white hover:text-gray-200 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/university/enquiries/admin"
          className="text-white hover:text-gray-200 transition"
        >
          Enquiries
        </Link>
        <Link
          to="/university/admissionleads/admin"
          className="text-white hover:text-gray-200 transition"
        >
          Admission Leads
        </Link>
      </div>

      {/* Welcome message and logout button */}
      <div className="flex items-center">
        <span className="text-white mr-4">
          Welcome to {universityName ? universityName : "Admin"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
