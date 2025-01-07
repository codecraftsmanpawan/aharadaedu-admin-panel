import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaPhoneAlt, FaFileAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import Navbar from "./components/Navbar";
import base_url from "../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("universityloginaradradha");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    // Fetch data from the API using Axios
    const config = {
      method: "get",
      url: `${base_url}/api/university/auth/details`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.data); // Set the response data to state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Return loading message while data is being fetched
  if (!data) {
    return <div>Loading...</div>;
  }

  // Chart Data for Admission Leads, Enquiries, and Programs by Date
  const admissionLeadChartData = {
    labels: data.admissionLeadCountsByDate.map((entry) => entry._id),
    datasets: [
      {
        label: "Admission Leads",
        data: data.admissionLeadCountsByDate.map((entry) => entry.count),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.1,
      },
    ],
  };

  const enquiryChartData = {
    labels: data.enquiryCountsByDate.map((entry) => entry._id),
    datasets: [
      {
        label: "Enquiries",
        data: data.enquiryCountsByDate.map((entry) => entry.count),
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,0.2)",
        tension: 0.1,
      },
    ],
  };

  const programChartData = {
    labels: data.programCountsByDate.map((entry) => entry._id),
    datasets: [
      {
        label: "Programs",
        data: data.programCountsByDate.map((entry) => entry.count),
        borderColor: "rgba(255,159,64,1)",
        backgroundColor: "rgba(255,159,64,0.2)",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <Navbar universityName={data.universityName} />{" "}
      {/* Pass universityName as a prop */}
      <div className="p-6">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Admission Leads</h3>
              <p className="text-2xl font-bold">{data.admissionLeadCount}</p>
            </div>
            <FaUsers className="text-4xl text-blue-600" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Enquiries</h3>
              <p className="text-2xl font-bold">{data.enquiryCount}</p>
            </div>
            <FaPhoneAlt className="text-4xl text-green-600" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Programs</h3>
              <p className="text-2xl font-bold">{data.programCount}</p>
            </div>
            <FaFileAlt className="text-4xl text-purple-600" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Admission Leads By Date
            </h3>
            <Line data={admissionLeadChartData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Enquiries By Date</h3>
            <Line data={enquiryChartData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Programs By Date</h3>
            <Line data={programChartData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
