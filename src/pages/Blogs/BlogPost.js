import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import base_url from "../../config";
const BlogPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [editorValue, setEditorValue] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Handle the editor content change
  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  // Handle file change for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      toast.success(`Image selected: ${file.name}`);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    // Check for empty content
    if (editorValue === "") {
      toast.error("Content is required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", editorValue);
    formData.append("category", data.category);
    formData.append("tags", data.tags);
    if (image) formData.append("image", image);

    // Retrieve the token from localStorage
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("Authorization token missing!");
      return;
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${base_url}/api/blogs`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      toast.success("Blog post created successfully!");
      navigate("/admin/blog");
    } catch (error) {
      if (error.response && error.response.data) {
        // Display the error message from the response if it exists
        const errorMessage =
          error.response.data.message ||
          "Failed to add blog post. Please try again.";
        toast.error(errorMessage);
      } else {
        // If the error response doesn't have a message, show a generic error
        toast.error("Failed to add blog post. Please try again.");
      }
      console.error("Error adding blog post:", error.response?.data);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={editorValue}
            onChange={handleEditorChange}
            className="mt-2"
            theme="snow"
          />
          {editorValue === "" && (
            <p className="text-red-500 text-xs mt-1">Content is required</p>
          )}
        </div>

        {/* Category Input */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            {...register("category", { required: "Category is required" })}
            type="text"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter category"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Tags Input */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            id="tags"
            {...register("tags", { required: "Tags are required" })}
            type="text"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter tags (comma-separated)"
          />
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Submit Blog Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
