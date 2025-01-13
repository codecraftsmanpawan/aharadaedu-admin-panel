import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import base_url from "../../config";
const BlogTable = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(15);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  // Fetch blog posts from the API
  useEffect(() => {
    axios
      .get(`${base_url}/api/blogs`)
      .then((response) => {
        setBlogs(response.data.blogPosts);
        setTotalBlogs(response.data.blogPosts.length);
      })
      .catch((error) => {
        console.error("There was an error fetching the blogs!", error);
        toast.error("Error fetching blogs!");
      });
  }, []);

  // Get current blogs for the page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  // Confirm delete blog post
  const confirmDeleteBlog = () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) {
      toast.error("Authorization token missing!");
      return;
    }

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${base_url}/api/blogs/${blogToDelete}`,
      headers: {
        Authorization: `Bearer ${token}`, // Use token from local storage
      },
    };

    axios
      .request(config)
      .then((response) => {
        setBlogs(blogs.filter((blog) => blog._id !== blogToDelete));
        toast.success("Blog post deleted successfully!");
        closeDeleteModal();
      })
      .catch((error) => {
        toast.error("Error deleting blog post!");
        console.error("There was an error deleting the blog!", error);
      });
  };

  const handleViewClick = (id) => {
    navigate(`/admin/blogDetail/${id}`); // Navigate to the blog detail page using blog id
  };

  return (
    <div className="container mx-auto my-4 p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts List</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => navigate("/admin/blogpost")} // Navigate to blog post creation page
        >
          Add Blog
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">S.No</th>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Category</th>
            <th className="border px-4 py-2 text-left">Published Date</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <tr key={blog._id}>
                <td className="border px-4 py-2">
                  {indexOfFirstBlog + index + 1}
                </td>
                <td className="border px-4 py-2">{blog.title}</td>
                <td className="border px-4 py-2">{blog.category}</td>
                <td className="border px-4 py-2">
                  {new Date(blog.publishedDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2 justify-center flex space-x-2">
                  <button
                    onClick={() => openDeleteModal(blog._id)}
                    className="text-white bg-red-500 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewClick(blog._id)} // Pass blog id to the view handler
                    className="text-white bg-blue-500 px-2 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="border px-4 py-2 text-center">
                No blog posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border mr-2 bg-gray-200 text-gray-700 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalBlogs / blogsPerPage)}
          className="px-4 py-2 border bg-gray-200 text-gray-700 rounded"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this blog post?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlog}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
