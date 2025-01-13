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
  FaRegEnvelope,
  FaRegCalendarAlt,
  FaRegBuilding,
  FaRegStar,
  FaRegFileAlt,
  FaSignOutAlt,
  FaBullhorn,
  FaTrophy,
  FaHandHoldingHeart,
  FaRegUserCircle,
  FaBlog,
  FaBirthdayCake,
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
      <div className={`${isSidebarOpen ? "block" : "hidden"} mt-16`}>
        <ul className="overflow-y-auto">
          <li>
            <Link to="/admin" className="block p-2 hover:bg-gray-600 rounded">
              <FaHome className="inline-block mr-2" /> Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/admin/list-university"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegBuilding className="inline-block mr-2" /> View University
            </Link>
          </li>
          <li>
            <Link
              to="/admin/video/feedback"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegCalendarAlt className="inline-block mr-2" /> Video Feedback
            </Link>
          </li>
          <li>
            <Link
              to="/admin/testimonial"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegStar className="inline-block mr-2" /> Testimonials
            </Link>
          </li>
          <li>
            <Link
              to="/admin/collaboratorslist"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegFileAlt className="inline-block mr-2" /> Collaborators
            </Link>
          </li>
          <li>
            <Link
              to="/admin/facultymembers"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaUsers className="inline-block mr-2" /> Faculty Members
            </Link>
          </li>
          <li>
            <Link
              to="/admin/placementteams"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaTrophy className="inline-block mr-2" /> Placement Teams
            </Link>
          </li>
          <li>
            <Link
              to="/admin/placedstudent"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaHandHoldingHeart className="inline-block mr-2" /> Placed
              Student
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teammember"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegUserCircle className="inline-block mr-2" /> Team Members
            </Link>
          </li>
          <li>
            <Link
              to="/admin/events"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegCalendarAlt className="inline-block mr-2" /> Events
            </Link>
          </li>
          <li>
            <Link
              to="/admin/internship"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaBullhorn className="inline-block mr-2" /> Internship
            </Link>
          </li>
          <li>
            <Link
              to="/admin/alumni"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegStar className="inline-block mr-2" /> Alumni
            </Link>
          </li>
          <li>
            <Link
              to="/admin/notices"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaRegFileAlt className="inline-block mr-2" /> Notices
            </Link>
          </li>
          <li>
            <Link
              to="/admin/blog"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaBlog className="inline-block mr-2" /> Blog{" "}
              {/* Blog link added */}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/birthdayWish"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaBirthdayCake className="inline-block mr-2" /> Birthday Wish
            </Link>
          </li>
          {/* <li>
            <Link
              to="/admin/settings"
              className="block p-2 hover:bg-gray-600 rounded"
            >
              <FaCog className="inline-block mr-2" /> Settings
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Sidebar Icons (Always visible when sidebar is collapsed) */}
      {!isSidebarOpen && (
        <div className="block">
          <Link to="/admin" className="block p-2 hover:bg-gray-600 rounded">
            <FaHome className="text-2xl" />
          </Link>

          <Link
            to="/admin/list-university"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegBuilding className="text-2xl" />
          </Link>
          <Link
            to="/admin/video/feedback"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegCalendarAlt className="text-2xl" />
          </Link>
          <Link
            to="/admin/testimonial"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegStar className="text-2xl" />
          </Link>
          <Link
            to="/admin/collaboratorslist"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegFileAlt className="text-2xl" />
          </Link>
          <Link
            to="/admin/facultymembers"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaUsers className="text-2xl" />
          </Link>
          <Link
            to="/admin/placementteams"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaTrophy className="text-2xl" />
          </Link>
          <Link
            to="/admin/placedstudent"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaHandHoldingHeart className="text-2xl" />
          </Link>
          <Link
            to="/admin/teammember"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegUserCircle className="text-2xl" />
          </Link>
          <Link
            to="/admin/events"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegCalendarAlt className="text-2xl" />
          </Link>
          <Link
            to="/admin/internship"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaBullhorn className="text-2xl" />
          </Link>
          <Link
            to="/admin/alumni"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegStar className="text-2xl" />
          </Link>
          <Link
            to="/admin/notices"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaRegFileAlt className="text-2xl" />
          </Link>
          <Link
            to="/admin/blog"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaBlog className="text-2xl" />{" "}
            {/* Blog icon added for collapsed sidebar */}
          </Link>
          <Link
            to="/admin/birthdayWish"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaBirthdayCake className="text-2xl" />
          </Link>
          {/* <Link
            to="/admin/settings"
            className="block p-2 hover:bg-gray-600 rounded"
          >
            <FaCog className="text-2xl" />
          </Link> */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
