import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { ToastContainer, toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import base_url from "../../config";
const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
  });

  useEffect(() => {
    // Fetch events data when the component is mounted
    axios
      .get(`${base_url}/api/events`)
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events data:", error);
      });
  }, []);

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    const token = localStorage.getItem("AharadaadminauthToken");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    axios
      .delete(`${base_url}/api/events/${eventToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Event deleted successfully!");
        setEvents(events.filter((event) => event._id !== eventToDelete));
        setShowDeleteModal(false);
      })
      .catch((error) => {
        toast.error("Error deleting event!");
        setShowDeleteModal(false);
      });
  };

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("AharadaadminauthToken");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    data.append("image", formData.image);

    try {
      const response = await axios.post(`${base_url}/api/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event added successfully!");
      setEvents([...events, response.data.event]);
      setShowAddEventModal(false);

      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to add event. Please try again."
        );
      } else {
        toast.error("Failed to add event. Please try again.");
      }
      console.error("Error adding event:", error.response?.data);
    }
  };
  const handleViewEvent = (title) => {
    navigate(`/admin/event/${title}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events List </h1>
        <button
          onClick={() => setShowAddEventModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Event
        </button>
      </div>

      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Time</th>
            <th className="py-2 px-4 text-left">Location</th>
            <th className="py-2 px-4 text-left">Image</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event, index) =>
              event ? (
                <tr key={event._id} className="border-t">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{event.title}</td>
                  <td className="py-2 px-4">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{event.time}</td>
                  <td className="py-2 px-4">{event.location}</td>
                  <td className="py-2 px-4">
                    <img
                      src={`${base_url}${event.image}`}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewEvent(event.title)}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ) : null
            )
          ) : (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-center">
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this event?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="title"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="location"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="date"
                  >
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="time"
                  >
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="description"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="image"
                >
                  Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default EventsTable;
