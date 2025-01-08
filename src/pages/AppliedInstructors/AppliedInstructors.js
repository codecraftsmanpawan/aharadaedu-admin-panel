import React, { useEffect, useState } from "react";
import axios from "axios";
import base_url from "../../config";
const AppliedInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInstructors, setTotalInstructors] = useState(0);

  const fetchInstructors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/api/applied-instructors`, {
        params: {
          page: page,
          itemsPerPage: 5,
        },
      });

      // Sort instructors by dateApplied in descending order
      const sortedInstructors = response.data.instructors.sort(
        (a, b) => new Date(b.dateApplied) - new Date(a.dateApplied)
      );

      setInstructors(sortedInstructors);
      setTotalPages(response.data.totalPages);
      setTotalInstructors(response.data.totalInstructors);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Applied Instructors
      </h2>

      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {!loading && instructors.length === 0 && (
        <div className="text-center text-gray-600">No instructors found.</div>
      )}

      {!loading && instructors.length > 0 && (
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left text-gray-600">#</th>
              <th className="p-3 border-b text-left text-gray-600">Name</th>
              <th className="p-3 border-b text-left text-gray-600">
                Phone Number
              </th>
              <th className="p-3 border-b text-left text-gray-600">Email</th>
              <th className="p-3 border-b text-left text-gray-600">
                Qualification
              </th>
              <th className="p-3 border-b text-left text-gray-600">
                Experience
              </th>
              <th className="p-3 border-b text-left text-gray-600">
                Resume Link
              </th>
              <th className="p-3 border-b text-left text-gray-600">
                Date Applied
              </th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, index) => (
              <tr key={instructor._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  {(currentPage - 1) * 5 + index + 1}
                </td>
                <td className="p-3 border-b">{instructor.name}</td>
                <td className="p-3 border-b">{instructor.phone}</td>
                <td className="p-3 border-b">{instructor.email}</td>
                <td className="p-3 border-b">{instructor.qualification}</td>
                <td className="p-3 border-b">{instructor.experience}</td>
                <td className="p-3 border-b">
                  <a
                    href={`/resumes/${instructor.resumeLink}`}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {instructor.resumeLink}
                  </a>
                </td>
                <td className="p-3 border-b">
                  {new Date(instructor.dateApplied).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AppliedInstructors;
