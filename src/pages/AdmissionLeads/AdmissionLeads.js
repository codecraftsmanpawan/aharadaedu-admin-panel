import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import base_url from "../../config";

const AdmissionLeads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("AharadaadminauthToken");
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${base_url}/api/admission-leads/display`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.request(config);
        setLeads(response.data.admissionLeads || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    // Initial fetch
    fetchLeads();

    // Refresh data every 5 seconds
    const interval = setInterval(fetchLeads, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Filter and search logic
  const filteredLeads = leads.filter((lead) => {
    return (
      (lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.email.toLowerCase().includes(search.toLowerCase())) &&
      (!filterState || lead.state === filterState) &&
      (!filterProgram || lead.program === filterProgram) &&
      (!filterUniversity || lead.university === filterUniversity) &&
      (!filterStatus || lead.status === filterStatus)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Admission Leads
        </h2>
        <CSVLink
          data={filteredLeads}
          filename="admission_leads.csv"
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
          placeholder="Search by name, phone, or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
        >
          <option value="">All States</option>
          {[...new Set(leads.map((lead) => lead.state))].map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
        >
          <option value="">All Programs</option>
          {[...new Set(leads.map((lead) => lead.program))].map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
        >
          <option value="">All Universities</option>
          {[...new Set(leads.map((lead) => lead.university))].map(
            (university) => (
              <option key={university} value={university}>
                {university}
              </option>
            )
          )}
        </select>
      </div>

      {filteredLeads.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-left text-gray-600">#</th>
                <th className="p-3 border-b text-left text-gray-600">Name</th>
                <th className="p-3 border-b text-left text-gray-600">Phone</th>
                <th className="p-3 border-b text-left text-gray-600">Email</th>
                <th className="p-3 border-b text-left text-gray-600">State</th>
                <th className="p-3 border-b text-left text-gray-600">
                  District
                </th>
                <th className="p-3 border-b text-left text-gray-600">
                  University
                </th>
                <th className="p-3 border-b text-left text-gray-600">
                  Program
                </th>
                <th className="p-3 border-b text-left text-gray-600">Branch</th>
                <th className="p-3 border-b text-left text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedLeads.map((lead, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 border-b">{lead.name}</td>
                  <td className="p-3 border-b">{lead.phone}</td>
                  <td className="p-3 border-b">{lead.email}</td>
                  <td className="p-3 border-b">{lead.state}</td>
                  <td className="p-3 border-b">{lead.district}</td>
                  <td className="p-3 border-b">{lead.university}</td>
                  <td className="p-3 border-b">{lead.program}</td>
                  <td className="p-3 border-b">{lead.branch}</td>
                  <td className="p-3 border-b">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
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
        <p className="text-center text-gray-600">
          No admission leads available.
        </p>
      )}
    </div>
  );
};

export default AdmissionLeads;
