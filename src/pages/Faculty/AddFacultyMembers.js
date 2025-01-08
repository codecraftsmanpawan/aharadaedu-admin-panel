import React, { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import base_url from "../../config";

const AddFacultyForm = () => {
  const [facultyName, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [workshopsConducted, setWorkshopsConducted] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
  });
  const [aboutResearchInterests, setAboutResearchInterests] = useState("");
  const [image, setImage] = useState(null);

  // For dynamic publications and courses
  const [publications, setPublications] = useState([
    { title: "", journal: "", year: "", link: "" },
  ]);
  const [coursesTaught, setCoursesTaught] = useState([
    { courseName: "", semester: "", year: "" },
  ]);
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePublicationChange = (index, field, value) => {
    const updatedPublications = [...publications];
    updatedPublications[index][field] = value;
    setPublications(updatedPublications);
  };

  const addPublication = () => {
    setPublications([
      ...publications,
      { title: "", journal: "", year: "", link: "" },
    ]);
  };

  const removePublication = (index) => {
    const updatedPublications = publications.filter((_, i) => i !== index);
    setPublications(updatedPublications);
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCoursesTaught = [...coursesTaught];
    updatedCoursesTaught[index][field] = value;
    setCoursesTaught(updatedCoursesTaught);
  };

  const addCourse = () => {
    setCoursesTaught([
      ...coursesTaught,
      { courseName: "", semester: "", year: "" },
    ]);
  };

  const removeCourse = (index) => {
    const updatedCourses = coursesTaught.filter((_, i) => i !== index);
    setCoursesTaught(updatedCourses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("facultyName", facultyName);
    formData.append("email", email);
    formData.append("designation", designation);
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("workshopsConducted", workshopsConducted);
    formData.append("socialLinks[linkedin]", socialLinks.linkedin);
    formData.append("socialLinks[email]", email);
    formData.append("aboutResearchInterests", aboutResearchInterests);
    formData.append("publications", JSON.stringify(publications));
    formData.append("coursesTaught", JSON.stringify(coursesTaught));
    if (image) formData.append("image", image);

    // Initialize useNavigate

    try {
      const response = await Axios.post(`${base_url}/api/faculty`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem(
            "AharadaadminauthToken"
          )}`,
        },
      });

      toast.success("Faculty added successfully!");

      // Navigate to the faculty members page
      navigate("/admin/facultymembers");
      console.log("Faculty added successfully:", response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Failed to add faculty. Please try again."
        );
      } else {
        toast.error("Failed to add faculty. Please try again.");
      }
      console.error("Error adding faculty:", error.response.data);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Faculty</h1>
        <button
          onClick={() => (window.location.href = "/admin/addfaculty")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Faculty List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          {/* Profile Image Preview */}
          <div className="flex justify-center mb-4">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* Image Upload Input */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image:
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="facultyName"
              className="block text-sm font-medium text-gray-700"
            >
              Faculty Name:
            </label>
            <input
              type="text"
              id="facultyName"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation:
            </label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="workshopsConducted"
              className="block text-sm font-medium text-gray-700"
            >
              Workshops Conducted:
            </label>
            <input
              type="text"
              id="workshopsConducted"
              value={workshopsConducted}
              onChange={(e) => setWorkshopsConducted(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="yearsOfExperience"
              className="block text-sm font-medium text-gray-700"
            >
              Years of Experience:
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn:
            </label>
            <input
              type="text"
              id="linkedin"
              value={socialLinks.linkedin}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, linkedin: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid  gap-4">
          <div>
            <label
              htmlFor="aboutResearchInterests"
              className="block text-sm font-medium text-gray-700"
            >
              About Us:
            </label>
            <textarea
              id="aboutResearchInterests"
              value={aboutResearchInterests}
              onChange={(e) => setAboutResearchInterests(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Publications:
          </label>{" "}
          <button
            type="button"
            onClick={addPublication}
            className="text-blue-500 mt-4"
          >
            Add Publication
          </button>
          <div className="flex flex-wrap gap-4 mt-4">
            {publications.map((publication, index) => (
              <div key={index} className="flex space-x-4 w-full">
                <input
                  type="text"
                  value={publication.title}
                  onChange={(e) =>
                    handlePublicationChange(index, "title", e.target.value)
                  }
                  placeholder="Title"
                  className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={publication.journal}
                  onChange={(e) =>
                    handlePublicationChange(index, "journal", e.target.value)
                  }
                  placeholder="Journal"
                  className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={publication.year}
                  onChange={(e) =>
                    handlePublicationChange(index, "year", e.target.value)
                  }
                  placeholder="Year"
                  className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={publication.link}
                  onChange={(e) =>
                    handlePublicationChange(index, "link", e.target.value)
                  }
                  placeholder="Link (Optional)"
                  className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removePublication(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <label className="block text-sm font-medium text-gray-700">
            Courses Taught:
          </label>
          <button
            type="button"
            onClick={addCourse}
            className="text-blue-500 mt-4"
          >
            Add Course
          </button>
          <div className="flex flex-wrap gap-4 mt-4">
            {coursesTaught.map((course, index) => (
              <div key={index} className="flex space-x-10 w-full">
                <input
                  type="text"
                  value={course.courseName}
                  onChange={(e) =>
                    handleCourseChange(index, "courseName", e.target.value)
                  }
                  placeholder="Course Name"
                  className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={course.semester}
                  onChange={(e) =>
                    handleCourseChange(index, "semester", e.target.value)
                  }
                  placeholder="Semester"
                  className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={course.year}
                  onChange={(e) =>
                    handleCourseChange(index, "year", e.target.value)
                  }
                  placeholder="Year"
                  className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
};

export default AddFacultyForm;
