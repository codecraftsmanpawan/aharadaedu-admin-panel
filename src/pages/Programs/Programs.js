import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AddProgramModal from "./AddProgramModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import base_url from "../../config";

const ProgramsList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [newProgram, setNewProgram] = useState({
    name: "",
    shortname: "",
    description: "",
    yearFullTimeProgram: "",
    specialisationsOffered: [],
    monthsOfInternships: "",
    capstoneProjects: [],
    university: "",
  });
  const [editingProgram, setEditingProgram] = useState(null);
  const navigate = useNavigate();
  // Retrieve the universityId from the URL parameters
  const { universityId } = useParams();

  // Fetch the Authorization token from localStorage
  const token = localStorage.getItem("AharadaadminauthToken");

  // Fetch the programs when the component mounts
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        if (!token) {
          setError("Authorization token not found.");
          setLoading(false);
          return;
        }

        if (!universityId) {
          setError("University ID is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${base_url}/api/programs/programs/${universityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.data) {
          setPrograms(response.data.data);
        } else {
          setPrograms([]);
        }

        setLoading(false);
      } catch (error) {
        handleError(error);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [universityId, token]);

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Quill editor change for description
  const handleDescriptionChange = (value) => {
    setNewProgram((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Handle specializations and capstone projects as arrays
  const handleArrayInputChange = (e, type) => {
    const { value } = e.target;
    setNewProgram((prev) => {
      const updatedArray = value.split(",").map((item) => item.trim());
      return {
        ...prev,
        [type]: updatedArray,
      };
    });
  };

  // Toggle modal visibility
  const toggleModal = () => {
    if (isModalOpen) {
      // Reset the program state when closing the modal
      setEditingProgram(null);
      setNewProgram({
        name: "",
        shortname: "",
        description: "",
        yearFullTimeProgram: "",
        specialisationsOffered: [],
        monthsOfInternships: "",
        capstoneProjects: [],
        university: "",
      });
    }
    setIsModalOpen(!isModalOpen);
  };

  // Handle form submission to add a new program
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      shortname,
      description,
      yearFullTimeProgram,
      specialisationsOffered,
      monthsOfInternships,
      capstoneProjects,
    } = newProgram;

    if (
      !name ||
      !shortname ||
      !description ||
      !yearFullTimeProgram ||
      !specialisationsOffered.length ||
      !monthsOfInternships ||
      !capstoneProjects.length
    ) {
      setError("Please fill all the fields.");
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${base_url}/api/programs`,
        {
          name,
          shortname,
          description,
          yearFullTimeProgram,
          specialisationsOffered,
          monthsOfInternships,
          capstoneProjects,
          university: universityId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPrograms((prevPrograms) => [...prevPrograms, response.data.data]);
      setIsModalOpen(false); // Close the modal after adding the program
      toast.success("Program added successfully!");

      // Reload the page after a successful submission
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  };

  // Delete a program
  const deleteProgram = async () => {
    try {
      // Log the program ID to be deleted
      console.log(`Attempting to delete program with ID: ${programToDelete}`);

      const response = await axios.delete(
        `${base_url}/api/programs/${programToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response from the backend after successful deletion
      console.log("Response from server:", response);

      setPrograms(
        programs.filter((program) => program._id !== programToDelete)
      );
      setIsConfirmDeleteOpen(false);
      toast.success("Program deleted successfully!");
    } catch (error) {
      // Log any errors that occur during the process
      console.error("Error deleting program:", error);
      handleError(error);
      setIsConfirmDeleteOpen(false);
    }
  };

  // Edit a program
  const editProgram = (program) => {
    setEditingProgram(program);
    setNewProgram({
      ...program,
      specialisationsOffered: program.specialisationsOffered.join(", "),
      capstoneProjects: program.capstoneProjects.join(", "),
    });
    setIsModalOpen(true);
  };

  // Handle error messages from API
  const handleError = (error) => {
    if (error.response && error.response.data) {
      toast.error(
        error.response.data.message || "Something went wrong. Please try again."
      );
    } else {
      toast.error("An unknown error occurred. Please try again.");
    }
  };
  const viewProgram = (programId) => {
    navigate(`/admin/program/${programId}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold"> Programs Offered List</h1>
        <button
          onClick={() => {
            setEditingProgram(null);
            toggleModal();
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Program
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length > 0 ? (
          programs.map((program) => (
            <div
              key={program._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {program?.name || "N/A"}
              </h2>
              <h3 className="text-1xl mt-2 ml-1 font-semibold text-gray-800">
                {program?.shortname || "N/A"}
              </h3>

              <div className="mt-2">
                <h3 className="font-semibold text-gray-700">University</h3>
                <p className="text-gray-500">
                  {program?.university?.name || "N/A"}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => editProgram(program)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setProgramToDelete(program._id);
                    setIsConfirmDeleteOpen(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => viewProgram(program._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No programs available.
          </div>
        )}
      </div>

      {/* Add Program Modal */}
      <AddProgramModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        newProgram={newProgram}
        setNewProgram={setNewProgram}
        handleInputChange={handleInputChange}
        handleDescriptionChange={handleDescriptionChange}
        handleArrayInputChange={handleArrayInputChange}
        handleSubmit={handleSubmit}
        editingProgram={editingProgram}
      />

      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && (
        <ConfirmDeleteModal
          deleteProgram={deleteProgram}
          cancelDelete={() => setIsConfirmDeleteOpen(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProgramsList;
