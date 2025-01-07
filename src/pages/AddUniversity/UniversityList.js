import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import base_url from "../../config";
const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const fetchUniversities = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    const config = {
      method: "get",
      url: `${base_url}/api/universities`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      setUniversities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("AharadaadminauthToken");
    const config = {
      method: "delete",
      url: `${base_url}/api/universities/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.request(config);
      toast.success("University deleted successfully!");
      fetchUniversities(); // Refresh the list
      setDeleteModal(false); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting university:", error);
      toast.error("Failed to delete university. Please try again.");
    }
  };

  const openEditModal = (university) => {
    setCurrentUniversity(university);
    setUpdatedName(university.name);
    setUpdatedUsername(university.username);
    setUpdatedPassword(""); // Password is typically not fetched
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("AharadaadminauthToken");
    const data = {
      name: updatedName,
      username: updatedUsername,
      password: updatedPassword,
    };

    const config = {
      method: "put",
      url: `${base_url}/api/universities/${currentUniversity._id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    try {
      await axios.request(config);
      toast.success("University updated successfully!");
      setEditModal(false);
      fetchUniversities();
    } catch (error) {
      console.error("Error updating university:", error);

      // Check if the error has a response and display the message from the response
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to update university. Please try again."
        );
      } else {
        toast.error("Failed to update university. Please try again.");
      }
    }
  };

  const handleAddUniversity = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("AharadaadminauthToken");
    const data = {
      name: newName,
      username: newUsername,
      password: newPassword,
    };

    const config = {
      method: "post",
      url: `${base_url}/api/universities`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    try {
      await axios.request(config);
      toast.success("University added successfully!");
      setAddModal(false);
      fetchUniversities();
    } catch (error) {
      console.error("Error adding university:", error);

      // Check if the error has a response and display the message from the response
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to add university. Please try again."
        );
      } else {
        toast.error("Failed to add university. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">University List</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add University
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((university) => (
          <div
            key={university._id}
            className="bg-white p-4 shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-medium text-gray-800">
              {university.name}
            </h3>
            <p className="text-gray-600">
              <strong>Admin Username:</strong> {university.username}
            </p>
            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={() => openEditModal(university)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setUniversityToDelete(university);
                  setDeleteModal(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  navigate(`/admin/list-Programs/${university._id}`)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add University Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add University
            </h2>
            <form onSubmit={handleAddUniversity}>
              <div className="mb-4">
                <label
                  htmlFor="newName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  University Name
                </label>
                <input
                  type="text"
                  id="newName"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newUsername"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Admin Username
                </label>
                <input
                  type="text"
                  id="newUsername"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Admin Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Update University
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="updatedName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  University Name
                </label>
                <input
                  type="text"
                  id="updatedName"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="updatedUsername"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Admin Username
                </label>
                <input
                  type="text"
                  id="updatedUsername"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="updatedPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Admin Password
                </label>
                <input
                  type="password"
                  id="updatedPassword"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && universityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p>
              Are you sure you want to delete the university{" "}
              {universityToDelete.name}?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(universityToDelete._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UniversityList;
