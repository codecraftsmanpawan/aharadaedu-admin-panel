import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import base_url from "../../config";

const VideoFeedbackTable = () => {
  const [videoFeedbacks, setVideoFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  // Fetch video feedbacks on component mount
  useEffect(() => {
    const fetchVideoFeedbacks = async () => {
      try {
        const response = await axios.get(`${base_url}/api/videofeedbacks`);
        setVideoFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      name,
      videoUrl,
    };

    const token = localStorage.getItem("AharadaadminauthToken");

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${base_url}/api/videofeedbacks`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };

    try {
      // Create new video feedback
      const response = await axios.request(config);
      toast.success("Video feedback created successfully!");

      // Refresh the table
      setVideoFeedbacks((prev) => [...prev, response.data]);
      resetForm();

      // Reload the page after success
      window.location.reload();
    } catch (error) {
      // Check for specific error response and display appropriate message
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to add university. Please try again."
        );
      } else {
        toast.error("Failed to add university. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete (trigger confirmation modal)
  const handleDelete = (id) => {
    setFeedbackToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");

    try {
      await axios.delete(`${base_url}/api/videofeedbacks/${feedbackToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideoFeedbacks(
        videoFeedbacks.filter((feedback) => feedback._id !== feedbackToDelete)
      );
      toast.success("Video feedback deleted successfully!");
      setDeleteModalOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      toast.error("Failed to delete video feedback. Please try again.");
      setDeleteModalOpen(false);
      setFeedbackToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFeedbackToDelete(null);
  };

  // Open modal to add new feedback
  const openModal = () => {
    setModalOpen(true);
    resetForm();
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setVideoUrl("");
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Video Feedback List</h1>
        <button
          onClick={openModal} // Open modal on button click
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Video Feedback
        </button>
      </div>

      {/* Modal to add new feedback */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Submit Video Feedback
            </h2>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="videoUrl"
                >
                  Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter YouTube video URL"
                  required
                />
              </div>

              <div className="mb-4">
                {isLoading && (
                  <p className="text-center text-sm text-gray-500">
                    Submitting...
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Are you sure you want to delete this video feedback?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Feedback Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Video URL</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videoFeedbacks.map((feedback, index) => (
              <tr key={feedback._id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{index + 1}</td> {/* Serial Number */}
                <td className="py-2 px-4">{feedback.name}</td>
                <td className="py-2 px-4">
                  <a
                    href={feedback.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {feedback.videoUrl}
                  </a>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoFeedbackTable;
