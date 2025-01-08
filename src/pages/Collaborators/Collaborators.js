import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollaboratorsList = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    logo: null,
  });

  // Fetch the data from the API
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/collaborators"
        );
        setCollaborators(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching collaborators");
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  const openModal = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCollaborator(null);
    setShowModal(false);
    setShowAddModal(false); // Close Add Collaborator modal if open
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");

    // API request to delete the selected collaborator
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/collaborators/${selectedCollaborator._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the state to remove the deleted collaborator
      setCollaborators((prev) =>
        prev.filter(
          (collaborator) => collaborator._id !== selectedCollaborator._id
        )
      );

      // Close the modal and show a success toast
      closeModal();
      toast.success("Collaborator deleted successfully!");
    } catch (error) {
      closeModal();
      toast.error("Failed to delete collaborator.");
    }
  };

  const handleAddCollaborator = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("AharadaadminauthToken");

    // Create a new FormData object
    const data = new FormData();
    data.append("name", formData.name);
    data.append("website", formData.website);

    // Append the logo if selected
    if (formData.logo) {
      data.append("logo", formData.logo);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/collaborators",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show a success toast
      toast.success("Collaborator added successfully!");

      // Reload the page
      window.location.reload();
    } catch (error) {
      closeModal();
      toast.error("Failed to add collaborator.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "logo" ? files[0] : value,
    }));
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Collaborators List</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setShowAddModal(true)}
        >
          Add Collaborator
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden relative"
          >
            {/* Delete Icon */}
            <button
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-500"
              onClick={() => openModal(collaborator)}
              title="Delete Collaborator"
            >
              <FaTrash />
            </button>
            <img
              className="w-full h-45 object-cover"
              src={`http://localhost:5000${collaborator.logo}`}
              alt={collaborator.name}
              crossOrigin="anonymous"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {collaborator.name}
              </h3>
              <p className="text-sm text-gray-600">{collaborator.website}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedCollaborator.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Collaborator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Collaborator</h2>
            <form onSubmit={handleAddCollaborator}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Logo
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsList;
