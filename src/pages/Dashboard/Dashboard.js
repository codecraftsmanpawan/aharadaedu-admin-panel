import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaPhoneAlt,
  FaChartBar,
  FaRegClock,
  FaDollarSign,
  FaFileAlt,
  FaThumbsUp,
  FaTasks,
} from "react-icons/fa";

import { Line } from "react-chartjs-2";
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

// Registering Chart.js components
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AharadaadminauthToken");
    navigate("/");
  };

  // Chart data for Total Users, Total Inquiries, and Active Sessions
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [1200, 1300, 1400, 1500, 1600, 1700],
        fill: false,
        borderColor: "#4F46E5",
        tension: 0.1,
      },
    ],
  };

  const inquiryChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Inquiries",
        data: [800, 750, 820, 900, 950, 1000],
        fill: false,
        borderColor: "#FF4500",
        tension: 0.1,
      },
    ],
  };

  const activeSessionsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Sessions",
        data: [30, 35, 40, 45, 50, 55],
        fill: false,
        borderColor: "#32CD32",
        tension: 0.1,
      },
    ],
  };

  // Card style for consistency
  const cardStyle = {
    background: "linear-gradient(rgb(253, 251, 249), rgb(251, 250, 248))",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-gray-200 p-8">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Admission Leads with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaUsers size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Admission Leads
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">1250</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Admission Leads Chart
            </h3> */}
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 2: Total Enquiries with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaPhoneAlt size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Total Enquiries
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">823</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Enquiries Chart
            </h3> */}
            <Line data={inquiryChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 3: Total Complaints with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaChartBar size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Total Complaints
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">823</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Complaints Chart
            </h3> */}
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 4: Applied Instructors with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaRegClock size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Applied Instructors
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4 text-center">72</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Instructor Applications Chart
            </h3> */}
            <Line
              data={activeSessionsChartData}
              options={{ responsive: true }}
            />
          </div>
        </div>

        {/* Card 1: Admission Leads with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaUsers size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Admission Leads
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">1250</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Admission Leads Chart
            </h3> */}
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 2: Total Enquiries with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaPhoneAlt size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Total Enquiries
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">823</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Enquiries Chart
            </h3> */}
            <Line data={inquiryChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 3: Total Complaints with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaChartBar size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Total Complaints
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4  text-center">823</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Complaints Chart
            </h3> */}
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Card 4: Applied Instructors with Chart */}
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
          style={cardStyle}
        >
          <div className="flex items-center space-x-4">
            <FaRegClock size={30} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Applied Instructors
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-4 text-center">72</div>
          <div className="mt-4">
            {/* <h3 className="text-lg font-medium text-gray-600">
              Instructor Applications Chart
            </h3> */}
            <Line
              data={activeSessionsChartData}
              options={{ responsive: true }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
