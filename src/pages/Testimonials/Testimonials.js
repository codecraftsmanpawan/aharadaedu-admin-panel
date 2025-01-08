import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegStar, FaStar, FaTrashAlt } from "react-icons/fa";
import TestimonialForm from "./TestimonialForm";
import base_url from "../../config";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    axios
      .get(`${base_url}/api/testimonials`)
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching testimonials:", error);
      });
  }, []);

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      console.error("No token found!");
      return;
    }

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${base_url}/api/testimonials/${testimonialToDelete._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.request(config).then((response) => {
      console.log("Testimonial deleted:", response.data);
      setTestimonials(
        testimonials.filter((t) => t._id !== testimonialToDelete._id)
      );
      setIsModalOpen(false);
      setTestimonialToDelete(null);
    });
    //   .catch((error) => {
    //     console.error("Error deleting testimonial:", error);
    //   });
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setTestimonialToDelete(null);
  };

  const openFormModal = () => {
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="p-4">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials List</h1>
        <button
          onClick={openFormModal}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Testimonials
        </button>
      </div>
      <div className="grid mt-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="relative flex flex-col items-center bg-white p-6 rounded-lg shadow-md"
          >
            {/* Delete Icon at Top-Right */}
            <button
              onClick={() => handleDeleteClick(testimonial)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
              title="Remove Testimonial"
            >
              <FaTrashAlt className="w-5 h-5" />
            </button>

            <img
              src={`${base_url}/uploads/${testimonial.img}`}
              alt={testimonial.name || "Testimonial"}
              className="w-32 h-32 rounded-full object-cover mb-4"
              crossOrigin="anonymous"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {testimonial.designation}
            </p>
            <p className="text-center text-gray-500 mb-4 italic">
              "{testimonial.text}"
            </p>

            {/* Rating stars */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) =>
                index < testimonial.rating ? (
                  <FaStar key={index} className="text-yellow-500 w-5 h-5" />
                ) : (
                  <FaRegStar key={index} className="text-yellow-500 w-5 h-5" />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold text-gray-800">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Do you want to delete this testimonial?
            </p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Testimonial Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <TestimonialForm closeFormModal={closeFormModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
