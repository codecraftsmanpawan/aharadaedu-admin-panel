import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FacultyDetail = () => {
  const { facultyId } = useParams(); // Get the facultyId from the URL
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch faculty data from the API using axios
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/faculty/${facultyId}`
        );
        setFaculty(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [facultyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!faculty) {
    return <div>No faculty data found.</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Faculty Details</h1>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 p-8">
            <img
              src={`http://localhost:5000${faculty.imageUrl}`}
              alt={faculty.facultyName}
              className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0"
            />
            <div>
              <h2 className="text-2xl font-semibold">{faculty.facultyName}</h2>
              <p className="text-lg text-gray-700">
                Designation: {faculty.designation}
              </p>
              <p className="text-lg text-gray-700">
                Years of Experience: {faculty.yearsOfExperience}
              </p>
              <p className="text-lg text-gray-700">
                Workshops Conducted: {faculty.workshopsConducted}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Social Links</h3>
            <ul className="list-none mt-2">
              <li>
                <a
                  href={faculty.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  LinkedIn: {faculty.socialLinks.linkedin}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${faculty.socialLinks.email}`}
                  className="text-blue-600"
                >
                  Email: {faculty.socialLinks.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-6 max-w-3xl">
            <h3 className="text-xl font-semibold">About Us</h3>
            <p className="text-lg text-gray-700 break-words">
              {faculty.aboutResearchInterests}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Publications</h3>
            <ul className="list-none mt-2">
              {faculty.publications.map((publication) => (
                <li key={publication._id} className="text-lg text-gray-700">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {publication.title} - {publication.journal} (
                    {publication.year})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Courses Taught</h3>
            <ul className="list-none mt-2">
              {faculty.coursesTaught.map((course) => (
                <li key={course._id} className="text-lg text-gray-700">
                  {course.courseName} - Semester: {course.semester} - Year:{" "}
                  {course.year}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDetail;
