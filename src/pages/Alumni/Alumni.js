import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
function Alumni() {
  const [alumniData, setAlumniData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAlumniId, setSelectedAlumniId] = useState(null);
  const [newAlumni, setNewAlumni] = useState({
    name: "",
    year: "",
    course: "",
    email: "",
    placementCompany: "",
    jobTitle: "",
    linkedin: "",
    profilePhoto: null,
  });

  useEffect(() => {
    // Fetch alumni data from API
    axios
      .get(`${base_url}/api/alumni`)
      .then((response) => {
        setAlumniData(response.data.alumni);
      })
      .catch((error) => {
        console.error("Error fetching alumni data:", error);
        toast.error("Failed to load alumni data.");
      });
  }, []);

  const handleDelete = () => {
    if (selectedAlumniId) {
      const token = localStorage.getItem("AharadaadminauthToken");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      axios
        .delete(`${base_url}/api/alumni/${selectedAlumniId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setAlumniData(
            alumniData.filter((alumni) => alumni._id !== selectedAlumniId)
          );
          toast.success("Alumni deleted successfully!");
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error deleting alumni:", error);
          toast.error("Failed to delete alumni. Please try again.");
        });
    }
  };

  const handleAddAlumniChange = (e) => {
    const { name, value } = e.target;
    setNewAlumni((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddAlumniSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newAlumni.name);
    formData.append("year", newAlumni.year);
    formData.append("course", newAlumni.course);
    formData.append("email", newAlumni.email);
    formData.append("placementCompany", newAlumni.placementCompany);
    formData.append("jobTitle", newAlumni.jobTitle);
    formData.append("linkedin", newAlumni.linkedin);
    if (newAlumni.profilePhoto) {
      formData.append("profilePhoto", newAlumni.profilePhoto);
    }

    axios
      .post(`${base_url}/api/alumni`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAlumniData((prev) => [...prev, response.data.alumni]);
        toast.success("Alumni added successfully!");
        setShowAddModal(false);
        setNewAlumni({
          name: "",
          year: "",
          course: "",
          email: "",
          placementCompany: "",
          jobTitle: "",
          linkedin: "",
          profilePhoto: null,
        });

        // Refresh the page to fetch the latest data
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // Custom error message from the backend
          toast.error(
            error.response.data.message ||
              "Failed to add alumni. Please try again."
          );
          console.error("Error adding alumni:", error.response.data);
        } else {
          // General error message
          toast.error("Failed to add alumni. Please try again.");
          console.error("Error adding alumni:", error);
        }
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alumni List</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Alumni
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
                Profile
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Job Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Course
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Batch
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                LinkedIn
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {alumniData &&
              alumniData.map(
                (alumni, index) =>
                  alumni ? ( // Check if alumni is defined
                    <tr key={alumni._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{index + 1}</td>

                      <td className="px-6 py-4">
                        {alumni.profilePhoto ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${base_url}${alumni.profilePhoto}`}
                            alt={alumni.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold mx-auto">
                            {alumni.name.slice(0, 2)}{" "}
                            {/* Fallback to the first two letters of the name */}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-800">{alumni.name}</td>
                      <td className="px-6 py-4 text-gray-800">
                        {alumni.jobTitle}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {alumni.course}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {alumni.year} Batch
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={alumni.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          LinkedIn
                        </a>
                      </td>

                      <td className="px-6 py-4 text-gray-800">
                        {alumni.email}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {alumni.placementCompany}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedAlumniId(alumni._id);
                            setShowModal(true); // Trigger the delete modal
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ) : null // Skip rendering if alumni is undefined
              )}
          </tbody>
        </table>
      </div>

      {/* Add Alumni Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Add New Alumni</h3>
            <form
              onSubmit={handleAddAlumniSubmit}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newAlumni.name}
                  onChange={handleAddAlumniChange}
                  placeholder="Name"
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={newAlumni.course}
                  onChange={handleAddAlumniChange}
                  placeholder="Course"
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  value={newAlumni.year}
                  onChange={handleAddAlumniChange}
                  placeholder="Year"
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={newAlumni.email}
                  onChange={handleAddAlumniChange}
                  placeholder="Email"
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Placement Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="placementCompany"
                  value={newAlumni.placementCompany}
                  onChange={handleAddAlumniChange}
                  placeholder="Placement Company"
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={newAlumni.jobTitle}
                  onChange={handleAddAlumniChange}
                  placeholder="Job Title"
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  LinkedIn URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={newAlumni.linkedin}
                  onChange={handleAddAlumniChange}
                  placeholder="LinkedIn URL"
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={(e) =>
                    setNewAlumni({
                      ...newAlumni,
                      profilePhoto: e.target.files[0],
                    })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div className="col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Add Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this alumni?
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

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeButton
      />
    </div>
  );
}

export default Alumni;
