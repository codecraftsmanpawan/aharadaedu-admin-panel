import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import base_url from "../../config";
const UniversityForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    establishedYear: "",
    coursesOffered: [],
    website: "",
    description: "",
    specializations: "",
    certifications: "",
    recognizedBy: [],
    universityImage: null,
    ranking: "",
  });

  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${base_url}/api/universities`);
        setUniversities(response.data.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        toast.error("Failed to load universities.");
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "coursesOffered" || name === "recognizedBy") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      universityImage: file,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("AharadaadminauthToken");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "universityImage" && formData[key]) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${base_url}/api/universitiesDetails`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("University details submitted successfully!");
      navigate("/admin/list-university");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message ||
          "Failed to add faculty. Please try again.";
        toast.error(errorMessage);
        console.error("Error adding faculty:", error.response.data);
      } else {
        toast.error("Failed to add faculty. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-left mb-6">
        Add University Details
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            University Name <span className="text-red-500">*</span>
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Select University
            </option>
            {universities.map((university) => (
              <option key={university._id} value={university.name}>
                {university.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter location"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Established Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="establishedYear"
            value={formData.establishedYear}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter established year"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Courses Offered <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="coursesOffered"
            value={formData.coursesOffered.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter courses offered"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Website <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter website URL"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Specializations <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter specializations"
            required
          />
        </div>

        <div className="mb-4 col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full border border-gray-300 rounded-md"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Certifications <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter certifications"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Recognized By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="recognizedBy"
            value={formData.recognizedBy.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter recognized by"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            University Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="universityImage"
            onChange={handleImageChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ranking <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="ranking"
            value={formData.ranking}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Enter ranking"
            required
          />
        </div>

        <div className="flex justify-center col-span-2">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UniversityForm;
