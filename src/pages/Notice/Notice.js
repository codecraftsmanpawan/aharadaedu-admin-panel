import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import base_url from "../../config";

const NoticesTable = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    content: null,
  });

  useEffect(() => {
    // Fetch the notices data from the backend
    axios
      .get(`${base_url}/api/notices`)
      .then((response) => {
        setNotices(response.data.notices);
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  // Handle delete notice
  const handleDelete = () => {
    // Get the token from localStorage
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    axios
      .delete(`${base_url}/api/notices/${selectedNoticeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setNotices(notices.filter((notice) => notice._id !== selectedNoticeId));
        setShowModal(false); // Close the modal
        toast.success("Notice deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
        toast.error("Failed to delete the notice. Please try again.");
      });
  };

  // Handle input changes for new notice
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice((prevNotice) => ({
      ...prevNotice,
      [name]: value,
    }));
  };

  // Handle file change for new notice
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewNotice((prevNotice) => ({
      ...prevNotice,
      content: file,
    }));
  };

  // Handle form submit for adding a notice
  const handleAddNotice = () => {
    // Get the token from localStorage
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newNotice.title);
    formData.append("description", newNotice.description);
    formData.append("content", newNotice.content);

    axios
      .post(`${base_url}/api/notices`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setNotices([response.data.notice, ...notices]);
        setShowModal(false); // Close the modal
        toast.success("Notice added successfully!");
        setNewNotice({
          title: "",
          description: "",
          content: null,
        });
        // Refresh the page
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            error.response.data.message ||
              "Failed to add notice. Please try again."
          );
          console.error("Error adding notice:", error.response.data);
        } else {
          toast.error("Failed to add notice. Please try again.");
          console.error("Error adding notice:", error);
        }
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notices List</h1>
        <button
          onClick={() => setShowModal("add")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Notice
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                File
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? (
              notices
                .filter((notice) => notice && notice._id)
                .map((notice, index) => (
                  <tr key={notice._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {notice?.title || "No title"}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {notice?.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {notice?.date
                        ? new Date(notice.date).toLocaleDateString()
                        : "No date"}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      <a
                        href={`${base_url}${notice?.content || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {notice?.content ? "Download" : "No file"}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-center">
                      <button
                        onClick={() => {
                          setSelectedNoticeId(notice._id);
                          setShowModal("delete");
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No notices available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Notice Modal */}
      {showModal === "add" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add Notice</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={newNotice.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={newNotice.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotice}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Notice Modal */}
      {showModal === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this notice?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NoticesTable;
