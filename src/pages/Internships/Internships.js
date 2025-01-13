import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const InternshipTable = () => {
  const [internships, setInternships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [newInternship, setNewInternship] = useState({
    internName: "",
    email: "",
    linkedin: "",
    jobTitle: "",
    batchYear: "",
    internshipDuration: "",
    company: "",
    profileImage: null,
  });

  // Fetch internships from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/api/internships`);
        setInternships(response.data.internships);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch internships.");
      }
    };
    fetchData();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInternship((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file change for profile image
  const handleFileChange = (e) => {
    setNewInternship((prevState) => ({
      ...prevState,
      profileImage: e.target.files[0],
    }));
  };

  // Add internship form submission
  const handleAddInternship = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the form data
    Object.keys(newInternship).forEach((key) => {
      formData.append(key, newInternship[key]);
    });

    try {
      const token = localStorage.getItem("AharadaadminauthToken");

      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      const config = {
        method: "post",
        url: `${base_url}/api/internships`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      const response = await axios(config);

      // Add the newly added internship to the local state without reloading the page
      setInternships((prev) => [...prev, response.data.internship]);
      toast.success("Internship added successfully!");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding internship:", error);
      toast.error("Failed to add internship.");
    }
  };

  // Delete internship
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("AharadaadminauthToken");

      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      const config = {
        method: "delete",
        url: `${base_url}/api/internships/${selectedInternshipId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios(config);
      setInternships((prev) =>
        prev.filter((internship) => internship._id !== selectedInternshipId)
      );
      toast.success("Internship deleted successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting internship:", error);
      toast.error("Failed to delete internship.");
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Internship List</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Internship
        </button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeButton
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-10">
                #
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-24">
                Profile Image
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-40">
                Intern Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-40">
                Job Title
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-40">
                Course & Batch
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-32">
                Duration
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-40">
                Company
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-32">
                LinkedIn
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-40">
                Email
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship, index) => {
              if (!internship) return null;
              return (
                <tr key={internship._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-800 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    {internship.profileImage ? (
                      <img
                        src={`${base_url}${internship.profileImage}`}
                        alt={internship.internName}
                        className="h-10 w-10 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold mx-auto">
                        {internship.internName.slice(0, 2)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    {internship.internName}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    {internship.jobTitle}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    {internship.batchYear}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    {internship.internshipDuration}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    {internship.company}
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    <a
                      href={internship.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      LinkedIn
                    </a>
                  </td>
                  <td className="px-4 py-4 text-gray-800 truncate">
                    <a
                      href={`mailto:${internship.email}`}
                      className="text-blue-500"
                    >
                      {internship.email}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedInternshipId(internship._id);
                        setShowModal(true);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Delete */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this internship?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Add Internship</h2>
            <form onSubmit={handleAddInternship}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">
                    Intern Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="internName"
                    placeholder="Intern Name"
                    value={newInternship.internName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newInternship.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    LinkedIn URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    value={newInternship.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={newInternship.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Course & Batch Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="batchYear"
                    placeholder="Course & Batch Year"
                    value={newInternship.batchYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Internship Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="internshipDuration"
                    placeholder="Internship Duration"
                    value={newInternship.internshipDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={newInternship.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Add Internship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipTable;
