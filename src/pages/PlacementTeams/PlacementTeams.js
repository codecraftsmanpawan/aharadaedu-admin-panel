import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import base_url from "../../config";
const PlacementTeam = () => {
  const [placementTeam, setPlacementTeam] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    linkedin: "",
    email: "",
    about: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchPlacementTeam = async () => {
      try {
        const response = await axios.get(`${base_url}/api/placement-team`);
        setPlacementTeam(response.data.placementTeam);
      } catch (error) {
        console.error("Error fetching placement team:", error);
      }
    };

    fetchPlacementTeam();
  }, []);

  const handleDelete = (memberId) => {
    setShowDeleteModal(true);
    setMemberToDelete(memberId);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("Authentication token not found!");
      setShowDeleteModal(false);
      return;
    }

    try {
      const config = {
        method: "delete",
        url: `${base_url}/api/placement-team/${memberToDelete}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(config);

      if (response.status === 200) {
        setPlacementTeam(
          placementTeam.filter((member) => member._id !== memberToDelete)
        );
        toast.success("Member deleted successfully!");
        setTimeout(() => {
          setShowDeleteModal(false);
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to delete the member!");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Error deleting member!");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const handleAddMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewMember((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newMember.name);
    formData.append("designation", newMember.designation);
    formData.append("linkedin", newMember.linkedin);
    formData.append("email", newMember.email);
    formData.append("about", newMember.about);
    formData.append("profileImage", newMember.profileImage);

    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("Authentication token not found!");
      setShowAddModal(false);
      return;
    }

    try {
      const config = {
        method: "post",
        url: `${base_url}/api/placement-team`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      const response = await axios(config);

      if (response.status === 201) {
        setPlacementTeam([...placementTeam, response.data.newMember]);
        toast.success("Member added successfully!");
        setShowAddModal(false);
        setTimeout(() => {
          window.location.reload(); // Reload the page after adding the member
        }, 2000);
      } else {
        toast.error("Failed to add member!");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Error adding member!");
    }
  };

  return (
    <>
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Placement Team List</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add Placement Team
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 border-b font-medium text-gray-700">
                  Image
                </th>
                <th className="px-6 py-3 border-b font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 border-b font-medium text-gray-700">
                  Designation
                </th>
                <th className="px-6 py-3 border-b font-medium text-gray-700">
                  About
                </th>
                <th className="px-6 py-3 border-b font-medium text-gray-700">
                  Contact
                </th>
                <th className="px-6 py-3 border-b font-medium text-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {placementTeam.map((member) =>
                member && member.name ? (
                  <tr key={member._id} className="hover:bg-gray-50">
                    {/* Image Column */}
                    <td className="px-6 py-4 border-b">
                      {member.profileImage ? (
                        <img
                          src={`${base_url}${member.profileImage}`}
                          alt={member.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600">No Image</span>
                        </div>
                      )}
                    </td>

                    {/* Name Column */}
                    <td className="px-6 py-4 border-b font-semibold">
                      {member.name}
                    </td>

                    {/* Designation Column */}
                    <td className="px-6 py-4 border-b">{member.designation}</td>

                    {/* About Column */}
                    <td className="px-6 py-4 border-b">{member.about}</td>

                    {/* Contact Column */}
                    <td className="px-6 py-4 border-b">
                      <div>
                        <p className="text-sm">
                          LinkedIn:{" "}
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Profile
                          </a>
                        </p>
                        <p className="text-sm">
                          Email:{" "}
                          <a
                            href={`mailto:${member.email}`}
                            className="text-blue-500 underline"
                          >
                            {member.email}
                          </a>
                        </p>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-500 hover:bg-red-100 px-3 py-2 rounded-full"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">
                Add Placement Team Member
              </h3>
              <form onSubmit={handleAddMemberSubmit}>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newMember.name}
                      onChange={handleAddMemberChange}
                      placeholder="Name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={newMember.designation}
                      onChange={handleAddMemberChange}
                      placeholder="Designation"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      LinkedIn URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={newMember.linkedin}
                      onChange={handleAddMemberChange}
                      placeholder="LinkedIn URL"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newMember.email}
                      onChange={handleAddMemberChange}
                      placeholder="Email"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    About <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="about"
                    value={newMember.about}
                    onChange={handleAddMemberChange}
                    placeholder="About"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Member Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">
                Are you sure you want to delete this member?
              </h3>
              <div className="flex justify-between">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default PlacementTeam;
