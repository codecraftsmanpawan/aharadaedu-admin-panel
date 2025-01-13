import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import base_url from "../../config";
const Complaints = () => {
  const [search, setSearch] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [allComplaints, setAllComplaints] = useState([]);

  useEffect(() => {
    // Fetch complaints from API when component mounts
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${base_url}/api/complaints`);
        setAllComplaints(response.data.complaints); // Store the fetched complaints
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // Filter and search logic
  const filteredComplaints = allComplaints.filter((complaint) => {
    return (
      (complaint.studentName.toLowerCase().includes(search.toLowerCase()) ||
        complaint.admissionNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        complaint.complaintType.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCampus || complaint.campus === filterCampus) &&
      (!filterStatus || complaint.status === filterStatus)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const displayedComplaints = filteredComplaints.slice(
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
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Complaints</h2>
        <CSVLink
          data={filteredComplaints}
          filename="complaints.csv"
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
          placeholder="Search by name, admission number, or complaint details"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterCampus}
          onChange={(e) => setFilterCampus(e.target.value)}
        >
          <option value="">All Campuses</option>
          <option value="meerut">IIMT University, Meerut</option>
          <option value="indore">SAGE University, Indore</option>
          <option value="subharti">Subharti University, Meerut</option>
          <option value="dev-bhoomi">Dev Bhoomi Uttarakhand University</option>
        </select>
        {/* <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select> */}
      </div>

      {filteredComplaints.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-left text-gray-600">#</th>
                <th className="p-3 border-b text-left text-gray-600">Name</th>
                <th className="p-3 border-b text-left text-gray-600">Campus</th>
                <th className="p-3 border-b text-left text-gray-600">
                  Admission Number
                </th>
                <th className="p-3 border-b text-left text-gray-600">
                  Complaint Type
                </th>
                <th className="p-3 border-b text-left text-gray-600">
                  Complaint Details
                </th>
                <th className="p-3 border-b text-left text-gray-600">
                  Document Proof
                </th>
                <th className="p-3 border-b text-left text-gray-600">Date</th>
                {/* <th className="p-3 border-b text-left text-gray-600">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {displayedComplaints.map((complaint, index) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 border-b">{complaint.studentName}</td>
                  <td className="p-3 border-b">{complaint.campus}</td>
                  <td className="p-3 border-b">{complaint.admissionNumber}</td>
                  <td className="p-3 border-b">{complaint.complaintType}</td>
                  <td className="p-3 border-b">{complaint.description}</td>
                  <td className="p-3 border-b">
                    <a
                      href={`${base_url}${complaint.attachments[0]}`}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {complaint.attachments[0].split("/").pop()}
                    </a>
                  </td>
                  <td className="p-3 border-b">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  {/* <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
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
        <p className="text-center text-gray-600">No complaints available.</p>
      )}
    </div>
  );
};

export default Complaints;
