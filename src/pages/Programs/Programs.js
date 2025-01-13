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
  const [universityToDelete, setUniversityToDelete] = useState(null);
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
  const [universityDetails, setUniversityDetails] = useState(null);
  const navigate = useNavigate();
  const { universityId, universityName } = useParams();

  const token = localStorage.getItem("AharadaadminauthToken");

  // Fetch university details and programs when the component mounts
  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/universitiesDetails/${decodeURIComponent(
            universityName
          )}`
        );
        if (response.data && response.data.university) {
          setUniversityDetails(response.data.university);
        }
      } catch (error) {
        // setError("Failed to fetch university details.");
        // toast.error("Failed to fetch university details.");
      }
    };

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

    fetchUniversityDetails();
    fetchPrograms();
  }, [universityId, universityName, token]);

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
      setIsModalOpen(false);
      toast.success("Program added successfully!");
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteProgram = async () => {
    try {
      const response = await axios.delete(
        `${base_url}/api/programs/${programToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrograms(
        programs.filter((program) => program._id !== programToDelete)
      );
      setIsConfirmDeleteOpen(false);
      toast.success("Program deleted successfully!");
    } catch (error) {
      console.error("Error deleting program:", error);
      handleError(error);
      setIsConfirmDeleteOpen(false);
    }
  };

  const deleteUniversityDetails = async () => {
    try {
      const response = await axios.delete(
        `${base_url}/api/universitiesDetails/${universityToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("University deleted successfully!");

      // Reload the page to reflect changes after deletion
      window.location.reload(); // This will refresh the page
    } catch (error) {
      console.error("Error deleting university:", error);
      handleError(error);
    }
  };

  const editProgram = (program) => {
    setEditingProgram(program);
    setNewProgram({
      ...program,
      specialisationsOffered: program.specialisationsOffered.join(", "),
      capstoneProjects: program.capstoneProjects.join(", "),
    });
    setIsModalOpen(true);
  };

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
        <h1 className="text-3xl font-bold">Programs Offered List</h1>
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
      {/* Display university image */}
      {universityDetails && universityDetails.image && (
        <div className="mt-4">
          <img
            src={`${base_url}${universityDetails.image}`}
            alt={`${universityDetails.name} image`}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
      )}

      {/* Display University Details */}
      {universityDetails && (
        <div className="mb-6 p-4 bg-gray-100 rounded shadow-lg">
          <h2 className="text-xl font-bold">{universityDetails.name}</h2>
          <p className="text-gray-700">
            {universityDetails.location || "Location not available"}
          </p>
          <p className="text-gray-500">
            Established Year:{" "}
            {universityDetails.establishedYear || "Year not available"}
          </p>
          <p className="text-gray-500">
            Ranking: {universityDetails.ranking || "Ranking not available"}
          </p>

          {/* Display description with dangerous HTML content */}
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html:
                universityDetails.description || "Description not available",
            }}
          ></div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Courses Offered</h3>
            <ul className="list-disc pl-5">
              {universityDetails.coursesOffered &&
              universityDetails.coursesOffered.length > 0 ? (
                universityDetails.coursesOffered.map((course, index) => (
                  <li key={index} className="text-gray-600">
                    {course}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No courses available</li>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Specializations</h3>
            <p className="text-gray-600">
              {universityDetails.specializations ||
                "No specializations available"}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Certifications</h3>
            <p className="text-gray-600">
              {universityDetails.certifications ||
                "No certifications available"}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Recognized By</h3>
            <ul className="list-disc pl-5">
              {universityDetails.recognizedBy &&
              universityDetails.recognizedBy.length > 0 ? (
                universityDetails.recognizedBy.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No recognitions available</li>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Website</h3>
            <a
              href={universityDetails.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {universityDetails.website || "Website not available"}
            </a>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                setUniversityToDelete(universityDetails._id);
                setIsConfirmDeleteOpen(true);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete University Details
            </button>
          </div>
        </div>
      )}

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

      {/* Confirm Delete University Modal */}
      {universityToDelete && isConfirmDeleteOpen && (
        <ConfirmDeleteModal
          deleteProgram={deleteUniversityDetails}
          cancelDelete={() => setIsConfirmDeleteOpen(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProgramsList;
