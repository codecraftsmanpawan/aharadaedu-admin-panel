import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const BirthdayWishList = () => {
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWishId, setSelectedWishId] = useState(null);
  const [newWishData, setNewWishData] = useState({
    username: "",
    message: "",
    birthdayDate: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

  const fetchBirthdayWishes = async () => {
    try {
      const response = await axios.get(`${base_url}/api/birthday-wishes`);
      setBirthdayWishes(response.data.birthdayWishes);
    } catch (error) {
      console.error("Error fetching birthday wishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token || !selectedWishId) return;

    try {
      await axios.delete(`${base_url}/api/birthday-wishes/${selectedWishId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBirthdayWishes(
        birthdayWishes.filter((wish) => wish._id !== selectedWishId)
      );
      toast.success("Birthday wish deleted successfully!", {
        autoClose: 2000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error deleting birthday wish:", error);
      toast.error("Error deleting birthday wish. Please try again.", {
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleAddWish = async () => {
    const token = localStorage.getItem("AharadaadminauthToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("username", newWishData.username);
    formData.append("message", newWishData.message);
    formData.append("birthdayDate", newWishData.birthdayDate);
    if (newWishData.profileImage) {
      formData.append("profileImage", newWishData.profileImage);
    }

    try {
      const response = await axios.post(
        `${base_url}/api/birthday-wishes`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBirthdayWishes([response.data.newWish, ...birthdayWishes]);
      toast.success("Birthday wish added successfully!", {
        autoClose: 2000,
        theme: "colored",
      });

      // Refresh the page after success
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 2 seconds to allow the toast to display
    } catch (error) {
      console.error("Error adding birthday wish:", error);
      toast.error("Error adding birthday wish. Please try again.", {
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      closeAddModal();
    }
  };

  const openDeleteModal = (id) => {
    setSelectedWishId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedWishId(null);
  };

  const openAddModal = () => setIsAddModalOpen(true);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewWishData({
      username: "",
      message: "",
      birthdayDate: "",
      profileImage: null,
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-md">
      <ToastContainer />
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Birthday Wishes List</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={openAddModal}
        >
          Add Birthday Wish
        </button>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Username</th>
            <th className="px-4 py-2 border-b">Birthday Date</th>
            <th className="px-4 py-2 border-b">Message</th>
            <th className="px-4 py-2 border-b">Profile Image</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {birthdayWishes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No birthday wishes found
              </td>
            </tr>
          ) : (
            birthdayWishes.map((wish, index) => {
              if (!wish) return null; // Skip undefined/null items
              return (
                <tr key={wish._id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{wish.username || "N/A"}</td>
                  <td className="px-4 py-2">
                    {wish.birthdayDate
                      ? new Date(wish.birthdayDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">{wish.message || "N/A"}</td>
                  <td className="px-4 py-2 text-center flex justify-center items-center">
                    {wish.profileImage ? (
                      <img
                        src={`${base_url}${wish.profileImage}`}
                        alt={wish.username || "Profile Image"}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/64?text=No+Image"
                        alt="No Image Available"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => openDeleteModal(wish._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 max-w-md">
            <h3 className="mb-6 text-xl font-semibold text-center text-gray-700">
              Confirm Deletion
            </h3>
            <div className="flex justify-around space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Birthday Wish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md">
            <h3 className="mb-4 text-lg font-semibold">Add Birthday Wish</h3>
            <div className="mb-2">
              <label>
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newWishData.username}
                onChange={(e) =>
                  setNewWishData({ ...newWishData, username: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label>
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newWishData.message}
                onChange={(e) =>
                  setNewWishData({ ...newWishData, message: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label>
                Birthday Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newWishData.birthdayDate}
                onChange={(e) =>
                  setNewWishData({
                    ...newWishData,
                    birthdayDate: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label>
                Profile Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setNewWishData({
                    ...newWishData,
                    profileImage: e.target.files[0],
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWish}
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayWishList;
