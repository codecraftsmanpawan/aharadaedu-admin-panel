import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/24/solid"; // Import icons
import { useNavigate } from "react-router-dom";
import base_url from "../../config";
const FacultyCard = () => {
  const [facultyData, setFacultyData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${base_url}/api/faculty`,
          headers: {},
        };

        const response = await axios.request(config);
        setFacultyData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleView = (facultyId) => {
    navigate(`/admin/faculty/${facultyId}`);
  };

  const handleUpdate = (facultyId) => {
    console.log("Update faculty", facultyId);
  };

  const handleDelete = (facultyId) => {
    console.log("Delete faculty", facultyId);
    setFacultyData(facultyData.filter((faculty) => faculty._id !== facultyId));
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faculty List</h1>
        <button
          onClick={() => (window.location.href = "/admin/addfaculty")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Faculty
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {facultyData.map((faculty) => (
          <div
            key={faculty._id}
            className="bg-white shadow-lg rounded-lg p-4 relative flex flex-col items-center"
          >
            {/* Delete Icon in the top-right corner */}
            <div
              onClick={() => handleDelete(faculty._id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600"
            >
              <TrashIcon className="w-6 h-6" />
            </div>

            {/* Profile Image - Circle and Centered */}
            <div className="flex justify-center items-center mb-4">
              <img
                src={
                  faculty.imageUrl.startsWith("/uploads")
                    ? `${base_url}${faculty.imageUrl}`
                    : faculty.imageUrl
                }
                alt={faculty.facultyName}
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
              />
            </div>
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {faculty.facultyName}
              </h2>
              <p className="text-gray-600 text-left">
                Designation: {faculty.designation}
              </p>
              <p className="text-gray-600 text-left">
                Experience: {faculty.yearsOfExperience} years
              </p>
              <p className="text-gray-600 text-left">
                Workshops Conducted: {faculty.workshopsConducted}
              </p>

              <div className="mt-4 text-left">
                <h3 className="font-bold">Contact:</h3>
                <p className="text-sm">
                  Email:{" "}
                  <a
                    href={`mailto:${faculty.socialLinks.email}`}
                    className="text-blue-500 underline"
                  >
                    {faculty.socialLinks.email}
                  </a>
                </p>
                <p className="text-sm">
                  LinkedIn:{" "}
                  <a
                    href={faculty.socialLinks.linkedin}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Profile
                  </a>
                </p>
              </div>
            </div>

            {/* View and Update Buttons */}
            <div className=" bottom-4 left-1 right-4 flex justify-between w-full">
              <div className="flex justify-start">
                <button
                  onClick={() => handleUpdate(faculty._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                >
                  Update
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleView(faculty._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyCard;
