// src/components/ConfirmDeleteModal.js
import React from "react";

const ConfirmDeleteModal = ({ deleteProgram, cancelDelete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Are you sure you want to delete this program?
        </h2>
        <div className="flex justify-around">
          <button
            onClick={deleteProgram}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
