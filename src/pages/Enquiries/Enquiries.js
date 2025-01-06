import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Function to fetch enquiries
    const fetchEnquiries = async () => {
      const token = localStorage.getItem("AharadaadminauthToken");
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/api/enquiries",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.request(config);
        setEnquiries(response.data.data || []);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    // Initial fetch
    fetchEnquiries();

    // Set interval to fetch data every 5 seconds
    const interval = setInterval(fetchEnquiries, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Filter and search logic
  const filteredEnquiries = enquiries.filter((enquiry) => {
    return (
      (enquiry.name.toLowerCase().includes(search.toLowerCase()) ||
        enquiry.phone.includes(search) ||
        enquiry.email.toLowerCase().includes(search.toLowerCase()) ||
        enquiry.message.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCampus || enquiry.campus === filterCampus) &&
      (!filterStatus || enquiry.status === filterStatus)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const displayedEnquiries = filteredEnquiries.slice(
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
        <h2 className="text-2xl font-semibold text-gray-800">Enquiries</h2>
        <CSVLink
          data={filteredEnquiries}
          filename="enquiries.csv"
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
          placeholder="Search by name, phone, email, or message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded p-2 w-full sm:w-auto"
          value={filterCampus}
          onChange={(e) => setFilterCampus(e.target.value)}
        >
          <option value="">All Campuses</option>
          {[...new Set(enquiries.map((enquiry) => enquiry.campus))].map(
            (campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            )
          )}
        </select>
      </div>

      {filteredEnquiries.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-left text-gray-600">#</th>
                <th className="p-3 border-b text-left text-gray-600">Name</th>
                <th className="p-3 border-b text-left text-gray-600">Phone</th>
                <th className="p-3 border-b text-left text-gray-600">Email</th>
                <th className="p-3 border-b text-left text-gray-600">Campus</th>
                <th className="p-3 border-b text-left text-gray-600">
                  Message
                </th>
                <th className="p-3 border-b text-left text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedEnquiries.map((enquiry, index) => (
                <tr key={enquiry._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 border-b">{enquiry.name}</td>
                  <td className="p-3 border-b">{enquiry.phone}</td>
                  <td className="p-3 border-b">{enquiry.email}</td>
                  <td className="p-3 border-b">{enquiry.campus}</td>
                  <td className="p-3 border-b">{enquiry.message}</td>
                  <td className="p-3 border-b">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
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
        <p className="text-center text-gray-600">No enquiries available.</p>
      )}
    </div>
  );
};

export default Enquiries;
