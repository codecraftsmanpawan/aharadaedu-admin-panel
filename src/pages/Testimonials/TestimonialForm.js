import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const TestimonialForm = ({ closeFormModal }) => {
  const [formData, setFormData] = useState({
    text: "",
    name: "",
    designation: "",
    rating: "",
    img: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, img: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const data = new FormData();
    data.append("text", formData.text);
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("rating", formData.rating);
    if (formData.img) {
      data.append("img", formData.img);
    }

    const token = localStorage.getItem("AharadaadminauthToken");

    try {
      const response = await axios.post(`${base_url}/api/testimonials`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setSuccess(true);
      setFormData({
        text: "",
        name: "",
        designation: "",
        rating: "",
        img: null,
      });
      toast.success("Testimonial submitted successfully!");
      setTimeout(() => {
        closeFormModal();
        // Reload the page after 2 seconds
        window.location.reload();
      }, 2000);
    } catch (err) {
      //   console.error("Error submitting testimonial:", err);

      // Error handling with toast notifications
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message ||
            "Failed to submit testimonial. Please try again."
        );
      } else {
        // toast.error("Failed to submit testimonial. Please try again.");
      }
      //   setError("Failed to submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md relative">
      {/* Close button */}
      <button
        onClick={closeFormModal}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        title="Close"
      >
        <FaTimes className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Add Testimonial
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Testimonial
          </label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            accept="image/*"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default TestimonialForm;
