import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import base_url from "../../config";

const TeamMember = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [about, setAbout] = useState("");
  const [designation, setDesignation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("AharadaadminauthToken");

    if (!token) {
      setMessage("Error: You must be logged in to add a team member.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("linkedin", linkedin);
    formData.append("about", about);
    formData.append("designation", designation);
    formData.append("profileImage", profileImage);

    try {
      setLoading(true);

      const response = await axios.post(
        `${base_url}/api/team-members`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setMessage("Team member added successfully!");
      setIsModalOpen(false);
      toast.success("Team member added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setLoading(false);

      // Custom error handling
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to add team member. Please try again."
        );
      } else {
        toast.error("Failed to add team member. Please try again.");
      }

      setMessage("Error adding team member.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) return;

    const config = {
      method: "delete",
      url: `${base_url}/api/team-members/${deleteMemberId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.request(config);
      setIsDeleteModalOpen(false);
      toast.success("Team member deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error deleting team member.");
      console.error("Error deleting team member:", error);
    }
  };

  const handleDeleteModal = (memberId) => {
    setDeleteMemberId(memberId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${base_url}/api/team-members`);
        setTeamMembers(response.data.teamMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <>
      <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Member List</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add Team Members
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-hidden relative"
            >
              <FaTrash
                onClick={() => handleDeleteModal(member._id)}
                className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 cursor-pointer shadow-md hover:bg-red-600 transition duration-300"
                size={34}
              />

              <div className="flex items-center space-x-4">
                <img
                  src={`${base_url}${member.profileImage}`}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <div className="overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {member.name}
                  </h3>
                  <p className="text-gray-700 mt-2">{member.designation}</p>{" "}
                  <p className="text-gray-600 truncate">{member.email}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                  <p className="text-gray-500 mt-2 break-words line-clamp-3">
                    {member.about}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Team Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                Add Team Member
              </h2>

              {/* {message && (
                <div
                  className={`text-center my-4 ${
                    message.includes("Error")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {message}
                </div>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* LinkedIn Field */}
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      LinkedIn Profile URL{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Designation Field */}
                  <div>
                    <label
                      htmlFor="designation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* About Field */}
                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    About <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows="4"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Profile Image */}
                <div>
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"
                    required
                  />
                </div>

                {/* Submit and Close Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md focus:outline-none hover:bg-gray-500"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-md shadow-md focus:outline-none hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Team Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                Confirm Delete
              </h2>
              <p className="text-center text-gray-700 mb-4">
                Are you sure you want to delete this team member?
              </p>
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md focus:outline-none hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md focus:outline-none hover:bg-red-700"
                >
                  Delete
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

export default TeamMember;
