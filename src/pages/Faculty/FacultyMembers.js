import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Toast CSS
import base_url from "../../config";

const FacultyCard = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${base_url}/api/faculty`,
          headers: {},
        };

        const response = await axios.request(config);
        setFacultyData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch faculty data.");
      }
    };

    fetchData();
  }, []);

  const handleView = (facultyId) => {
    navigate(`/admin/faculty/${facultyId}`);
  };

  const handleUpdate = (facultyId) => {
    console.log("Update faculty", facultyId);
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem("AharadaadminauthToken");
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${base_url}/api/faculty/${selectedFaculty}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      await axios.request(config);

      setFacultyData(
        facultyData.filter((faculty) => faculty._id !== selectedFaculty)
      );

      toast.success(`Faculty deleted successfully.`);
      setConfirmDelete(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error(`Error deleting faculty:`, error);
      toast.error("Failed to delete faculty.");
    }
  };

  const confirmDeleteModal = (facultyId) => {
    setSelectedFaculty(facultyId);
    setConfirmDelete(true);
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faculty List</h1>
        <button
          onClick={() => (window.location.href = "/admin/addfaculty")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Faculty
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
                Experience
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
            {facultyData.map((faculty) => (
              <tr key={faculty._id} className="hover:bg-gray-50">
                {/* Image Column */}
                <td className="px-6 py-4 border-b">
                  <img
                    src={
                      faculty.imageUrl.startsWith("/uploads")
                        ? `${base_url}${faculty.imageUrl}`
                        : faculty.imageUrl
                    }
                    alt={faculty.facultyName}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>

                {/* Name Column */}
                <td className="px-6 py-4 border-b font-semibold">
                  {faculty.facultyName}
                </td>

                {/* Designation Column */}
                <td className="px-6 py-4 border-b">{faculty.designation}</td>

                {/* Experience Column */}
                <td className="px-6 py-4 border-b">
                  {faculty.yearsOfExperience} years
                </td>

                {/* Contact Column */}
                <td className="px-6 py-4 border-b">
                  <div>
                    <p className="text-sm">
                      Email:{" "}
                      <a
                        href={`mailto:${faculty.socialLinks.email}`}
                        className="text-blue-500 underline"
                      >
                        {faculty.socialLinks.email}
                      </a>
                    </p>
                    <p className="text-sm">
                      LinkedIn:{" "}
                      <a
                        href={faculty.socialLinks.linkedin}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Profile
                      </a>
                    </p>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 border-b text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleUpdate(faculty._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleView(faculty._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => confirmDeleteModal(faculty._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this faculty?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCard;
