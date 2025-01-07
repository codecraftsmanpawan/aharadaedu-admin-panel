import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from "./components/Navbar";
import base_url from "../config";
const AdmissionLeadsTable = () => {
  const [admissionLeads, setAdmissionLeads] = useState([]);

  useEffect(() => {
    // Fetch admission leads data from the API
    const token = localStorage.getItem("universityloginaradradha");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const config = {
      method: "get",
      url: `${base_url}/api/university/auth/admission-leads`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setAdmissionLeads(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Handle Excel Export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(admissionLeads); // Convert JSON data to worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admission Leads");
    XLSX.writeFile(wb, "admission_leads.xlsx");
  };

  // Handle PDF Export
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Name",
          "Phone",
          "Email",
          "State",
          "District",
          "University",
          "Program",
          "Branch",
          "Created At",
        ],
      ],
      body: admissionLeads.map((lead) => [
        lead.name,
        lead.phone,
        lead.email,
        lead.state,
        lead.district,
        lead.university,
        lead.program,
        lead.branch,
        new Date(lead.createdAt).toLocaleString(),
      ]),
    });
    doc.save("admission_leads.pdf");
  };

  return (
    <>
      <Navbar />{" "}
      <div className="p-6">
        {/* Table Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admission Leads</h2>
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
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">District</th>
              <th className="p-3 text-left">University</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {admissionLeads.map((lead) => (
              <tr key={lead._id}>
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.state}</td>
                <td className="p-3">{lead.district}</td>
                <td className="p-3">{lead.university}</td>
                <td className="p-3">{lead.program}</td>
                <td className="p-3">{lead.branch}</td>
                <td className="p-3">
                  {new Date(lead.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdmissionLeadsTable;
