// src/components/AddProgramModal.js
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for Quill

const AddProgramModal = ({
  isModalOpen,
  toggleModal,
  newProgram,
  setNewProgram,
  handleInputChange,
  handleDescriptionChange,
  handleArrayInputChange,
  handleSubmit,
  editingProgram,
}) => {
  useEffect(() => {
    if (editingProgram) {
      // Ensure `specialisationsOffered` and `capstoneProjects` are arrays
      setNewProgram({
        ...editingProgram,
        specialisationsOffered: Array.isArray(
          editingProgram.specialisationsOffered
        )
          ? editingProgram.specialisationsOffered.join(", ")
          : "",
        capstoneProjects: Array.isArray(editingProgram.capstoneProjects)
          ? editingProgram.capstoneProjects.join(", ")
          : "",
      });
    }
  }, [editingProgram, setNewProgram]);

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editingProgram ? "Edit Program" : "Add New Program"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Program Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProgram.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Program Name"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Short Name
                </label>
                <input
                  type="text"
                  name="shortname"
                  value={newProgram.shortname}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Short Name"
                />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <ReactQuill
                  value={newProgram.description}
                  onChange={handleDescriptionChange}
                  className="w-full"
                  theme="snow"
                  placeholder="Program Description"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Specializations
                </label>
                <input
                  type="text"
                  value={newProgram.specialisationsOffered}
                  onChange={(e) =>
                    handleArrayInputChange(e, "specialisationsOffered")
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter specializations (comma separated)"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Capstone Projects
                </label>
                <input
                  type="text"
                  value={newProgram.capstoneProjects}
                  onChange={(e) =>
                    handleArrayInputChange(e, "capstoneProjects")
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter capstone projects (comma separated)"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Full-time Program Duration (Years)
                </label>
                <input
                  type="number"
                  name="yearFullTimeProgram"
                  value={newProgram.yearFullTimeProgram}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Program Duration"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Months of Internship
                </label>
                <input
                  type="number"
                  name="monthsOfInternships"
                  value={newProgram.monthsOfInternships}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Internship Duration"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              {editingProgram ? "Update Program" : "Add Program"}
            </button>
          </form>

          <button
            onClick={toggleModal}
            className="w-full bg-gray-500 text-white p-2 mt-4 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default AddProgramModal;
