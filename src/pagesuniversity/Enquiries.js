import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from "./components/Navbar";
import base_url from "../config";
const EnquiriesLeadsTable = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    // Fetch enquiries data from the API
    const token = localStorage.getItem("universityloginaradradha");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const config = {
      method: "get",
      url: `${base_url}/api/university/auth/enquiries`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setEnquiries(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Handle Excel Export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(enquiries); // Convert JSON data to worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
    XLSX.writeFile(wb, "enquiries.xlsx");
  };

  // Handle PDF Export
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Name", "Phone", "Email", "Campus", "Message", "Created At"]],
      body: enquiries.map((enquiry) => [
        enquiry.name,
        enquiry.phone,
        enquiry.email,
        enquiry.campus,
        enquiry.message,
        new Date(enquiry.createdAt).toLocaleString(),
      ]),
    });
    doc.save("enquiries.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="p-6" style={{ backgroundColor: "#f1f2e4" }}>
        {/* Table Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Enquiries</h2>
          <div className="flex space-x-4">
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export to PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Campus</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td className="p-3">{enquiry.name}</td>
                <td className="p-3">{enquiry.phone}</td>
                <td className="p-3">{enquiry.email}</td>
                <td className="p-3">{enquiry.campus}</td>
                <td className="p-3">{enquiry.message}</td>
                <td className="p-3">
                  {new Date(enquiry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EnquiriesLeadsTable;
