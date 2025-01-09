import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const PlacedStudents = () => {
  const [placedStudents, setPlacedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    batch: "",
    placementCompany: "",
    jobTitle: "",
    linkedinProfile: "",
  });

  useEffect(() => {
    // Fetch placed students data from the API
    axios
      .get(`${base_url}/api/placed-students`)
      .then((response) => {
        setPlacedStudents(response.data.placedStudents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (studentId) => {
    setShowModal(true);
    setStudentToDelete(studentId);
  };

  const handleDelete = () => {
    // Get the token from localStorage
    const token = localStorage.getItem("AharadaadminauthToken");

    if (!token) {
      toast.error("No token found for authentication");
      setShowModal(false);
      return;
    }

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${base_url}/api/placed-students/${studentToDelete}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Student deleted successfully!");
        setPlacedStudents((prev) =>
          prev.filter((student) => student._id !== studentToDelete)
        );
        setShowModal(false);
      })
      .catch((error) => {
        toast.error("Error deleting student");
        console.log(error);
        setShowModal(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddStudentFormToggle = () => {
    setShowAddForm(!showAddForm);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("AharadaadminauthToken");

    if (!token) {
      toast.error("No token found for authentication");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("department", formData.department);
    data.append("batch", formData.batch);
    data.append("placementCompany", formData.placementCompany);
    data.append("jobTitle", formData.jobTitle);
    data.append("linkedinProfile", formData.linkedinProfile);
    data.append("profileImage", image);

    const config = {
      method: "post",
      url: `${base_url}/api/placed-students`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Student added successfully!");
        setPlacedStudents((prev) => [...prev, response.data]);
        setShowAddForm(false);
        setFormData({
          name: "",
          email: "",
          department: "",
          batch: "",
          placementCompany: "",
          jobTitle: "",
          linkedinProfile: "",
        }); // Reset form data

        // Reload the page after successful addition
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error adding student");
        console.log(error);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Placed Students List</h1>
        <button
          onClick={handleAddStudentFormToggle}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Placed Students
        </button>
      </div>

      {/* Add Student Form in Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Add New Placed Student
            </h2>
            <form onSubmit={handleAddStudent}>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="batch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Batch
                  </label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="placementCompany"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Placement Company
                  </label>
                  <input
                    type="text"
                    id="placementCompany"
                    name="placementCompany"
                    value={formData.placementCompany}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="linkedinProfile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Image
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Grid */}
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
                Department
              </th>
              <th className="px-6 py-3 border-b font-medium text-gray-700">
                Batch
              </th>
              <th className="px-6 py-3 border-b font-medium text-gray-700">
                Job Title
              </th>
              <th className="px-6 py-3 border-b font-medium text-gray-700">
                LinkedIn
              </th>
              <th className="px-6 py-3 border-b font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 border-b font-medium text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {placedStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                {/* Image Column */}
                <td className="px-6 py-4 border-b">
                  <img
                    src={`${base_url}${student.profileImage}`}
                    alt={`${student.name}'s profile`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>

                {/* Name Column */}
                <td className="px-6 py-4 border-b font-semibold">
                  {student.name}
                </td>

                {/* Department Column */}
                <td className="px-6 py-4 border-b">{student.department}</td>

                {/* Batch Column */}
                <td className="px-6 py-4 border-b">{student.batch}</td>

                {/* Job Title Column */}
                <td className="px-6 py-4 border-b">{student.jobTitle}</td>

                {/* LinkedIn Column */}
                <td className="px-6 py-4 border-b">
                  <a
                    href={student.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                </td>

                {/* Email Column */}
                <td className="px-6 py-4 border-b">{student.email}</td>

                {/* Actions Column */}
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => handleDeleteClick(student._id)}
                    className="text-red-500 hover:bg-red-100 px-3 py-2 rounded-full"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for confirming delete */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this student?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default PlacedStudents;
