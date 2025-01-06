import React, { useState } from "react";
import { CSVLink } from "react-csv";

const AppliedInstructors = () => {
  const [search, setSearch] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allApplications = [
    {
      name: "Alice Johnson",
      phone: "9876543210",
      email: "alice@example.com",
      campus: "Campus A",
      appliedSubject: "Mathematics",
      qualification: "Ph.D. in Mathematics",
      experience: "10 years",
      resumeLink: "alice_resume.pdf",
      dateApplied: "2023-12-20",
      status: "Pending",
    },
    {
      name: "Bob Williams",
      phone: "8765432109",
      email: "bob@example.com",
      campus: "Campus B",
      appliedSubject: "Physics",
      qualification: "M.Sc. in Physics",
      experience: "5 years",
      resumeLink: "bob_resume.pdf",
      dateApplied: "2023-12-19",
      status: "Approved",
    },
    {
      name: "Charlie Brown",
      phone: "7654321098",
      email: "charlie@example.com",
      campus: "Campus C",
      appliedSubject: "Chemistry",
      qualification: "B.Sc. in Chemistry",
      experience: "2 years",
      resumeLink: "charlie_resume.pdf",
      dateApplied: "2023-12-18",
      status: "Rejected",
    },
  ];

  // Filter and search logic
  const filteredApplications = allApplications.filter((application) => {
    return (
      (application.name.toLowerCase().includes(search.toLowerCase()) ||
        application.phone.includes(search) ||
        application.email.toLowerCase().includes(search.toLowerCase()) ||
        application.appliedSubject
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!filterCampus || application.campus === filterCampus) &&
      (!filterStatus || application.status === filterStatus)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const displayedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Status Color Function
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Applied Instructors
        </h2>
        <CSVLink
          data={filteredApplications}
          filename="applied_instructors.csv"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </CSVLink>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          placeholder="Search by name, phone, email, or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterCampus}
          onChange={(e) => setFilterCampus(e.target.value)}
        >
          <option value="">All Campuses</option>
          <option value="Campus A">Campus A</option>
          <option value="Campus B">Campus B</option>
          <option value="Campus C">Campus C</option>
        </select>
        {/* <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select> */}
      </div>

      {filteredApplications.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-left text-gray-600">#</th>
                <th className="p-3 border-b text-left text-gray-600">Name</th>
                <th className="p-3 border-b text-left text-gray-600">
                  Phone Number
                </th>
                <th className="p-3 border-b text-left text-gray-600">Email</th>
                {/* <th className="p-3 border-b text-left text-gray-600">Campus</th> */}
                {/* <th className="p-3 border-b text-left text-gray-600">
                  Applied Subject
                </th> */}
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
                {/* <th className="p-3 border-b text-left text-gray-600">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {displayedApplications.map((application, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 border-b">{application.name}</td>
                  <td className="p-3 border-b">{application.phone}</td>
                  <td className="p-3 border-b">{application.email}</td>
                  {/* <td className="p-3 border-b">{application.campus}</td> */}
                  {/* <td className="p-3 border-b">{application.appliedSubject}</td> */}
                  <td className="p-3 border-b">{application.qualification}</td>
                  <td className="p-3 border-b">{application.experience}</td>
                  <td className="p-3 border-b">
                    <a
                      href={`/resumes/${application.resumeLink}`}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {application.resumeLink}
                    </a>
                  </td>
                  <td className="p-3 border-b">{application.dateApplied}</td>
                  {/* <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
        </>
      ) : (
        <p className="text-center text-gray-600">No applications available.</p>
      )}
    </div>
  );
};

export default AppliedInstructors;
