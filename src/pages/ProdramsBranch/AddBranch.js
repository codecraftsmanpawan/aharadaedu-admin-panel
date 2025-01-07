import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the CSS for ReactQuill
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const AddBranch = ({
  universityId,
  programId,
  token,
  onClose,
  onAddBranch,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDescriptionChange = (value) => {
    setDescription(value); // Set the rich text description value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the branch data object
    const branchData = {
      name,
      university: universityId,
      program: programId,
      description,
    };

    // Set up the request config
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${base_url}/api/branches`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(branchData),
    };

    try {
      // Send the request to the backend
      const response = await axios.request(config);
      toast.success("Branch added successfully!"); // Show success toast
      onAddBranch(response.data); // Update the branches list
      onClose(); // Close the modal after submission
      setName(""); // Clear form fields
      setDescription(""); // Clear description
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      // Handle error
      toast.error("Failed to add branch");
      console.log(error);
    } finally {
      setIsSubmitting(false); // Stop submitting state
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-sm overflow-y-auto"
        style={{ width: "100%" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Add Branch</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Branch Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Text Editor */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              className="h-40 overflow-auto custom-scrollbar"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Adding..." : "Add Branch"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddBranch;
