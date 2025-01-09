import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaRegClipboard,
  FaRegListAlt,
  FaQuestionCircle,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`w-${
        isSidebarOpen ? "64" : "16"
      } h-screen bg-gray-800 text-white transition-all relative`}
    >
      {/* Close Button (when sidebar is open) */}
      {isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 bg-gray-600 p-2 rounded-md"
        >
          <FaRegListAlt className="text-white text-xl" />
        </button>
      )}

      {/* Sidebar Toggle Button (when sidebar is collapsed) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="bg-gray-600 p-2 mt-3 ml-1 mr-2 rounded-md mb-4 flex items-center justify-center"
        >
          <FaRegListAlt className="text-white text-xl" />
        </button>
      )}

      {/* Sidebar Content (Visible only when sidebar is open) */}
      <ul className={`${isSidebarOpen ? "block" : "hidden"} mt-16`}>
        <li>
          <Link to="/admin" className="block p-2 hover:bg-gray-600 rounded">
            <FaHome className="inline-block mr-2" /> Dashboard
          </Link>
        </li>

        {/* New menu items */}
        <li>
          <Link
            to="/admin/admission-leads"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegClipboard className="inline-block mr-2" /> Admission Leads
          </Link>
        </li>
        <li>
          <Link
            to="/admin/enquiries"
            className="block p-2 mt-2 hover:bg-gray-600 rounded"
          >
            <FaQuestionCircle className="inline-block mr-2" /> Total Enquiries
          </Link>
        </li>
        <li>
          <Link
            to="/admin/complaints"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaQuestionCircle className="inline-block mr-2" /> Complaints
          </Link>
        </li>
        <li>
          <Link
            to="/admin/applied-instructors"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaChalkboardTeacher className="inline-block mr-2" /> Applied
            Instructors
          </Link>
        </li>

        <li>
          <Link
            to="/admin/list-university"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaUsers className="inline-block mr-2" /> View University
          </Link>
        </li>
        <li>
          <Link
            to="/admin/video/feedback"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" />
            Video Feedback
          </Link>
        </li>
        <li>
          <Link
            to="/admin/testimonial"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Testimonials
          </Link>
        </li>
        <li>
          <Link
            to="/admin/collaboratorslist"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Collaborators
          </Link>
        </li>
        <li>
          <Link
            to="/admin/facultymembers"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Faculty Members
          </Link>
        </li>
        <li>
          <Link
            to="/admin/placementteams"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Placement Teams
          </Link>
        </li>
        <li>
          <Link
            to="/admin/placedstudent"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Placed Student
          </Link>
        </li>
        <li>
          <Link
            to="/admin/teammember"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Team Members
          </Link>
        </li>
        <li>
          <Link
            to="/admin/settings"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="inline-block mr-2" /> Settings
          </Link>
        </li>
      </ul>

      {/* Sidebar Icons (Always visible when sidebar is collapsed) */}
      {!isSidebarOpen && (
        <div className="block">
          <Link to="/admin" className="block p-2 hover:bg-gray-600 rounded">
            <FaHome className="text-2xl" />
          </Link>

          {/* New icons for collapsed view */}
          <Link
            to="/admin/admission-leads"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegClipboard className="text-2xl" />
          </Link>
          <Link
            to="/admin/enquiries"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaQuestionCircle className="text-2xl" />
          </Link>
          <Link
            to="/admin/complaints"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaQuestionCircle className="text-2xl" />
          </Link>
          <Link
            to="/admin/applied-instructors"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaChalkboardTeacher className="text-2xl" />
          </Link>

          <Link
            to="/admin/list-university"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaUsers className="text-2xl" />
          </Link>
          <Link
            to="/admin/video/feedback"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/testimonial"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/collaboratorslist"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/facultymembers"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/placementteams"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/placedstudent"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/teammember"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
          <Link
            to="/admin/settings"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
