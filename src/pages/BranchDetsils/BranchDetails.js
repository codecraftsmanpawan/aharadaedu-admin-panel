// BranchPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import base_url from "../../config";
const BranchPage = () => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Capture the branchId from the URL
  const { branchId } = useParams();

  useEffect(() => {
    // Fetch the branch data from the API using branchId
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/branches/${branchId}`
        );
        setBranchData(response.data.data);
      } catch (err) {
        setError("Error fetching data from API");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [branchId]);

  // If loading, show a loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // If error, show an error message
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // If no error, render the branch data
  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Branch Details</h1>
      <div>
        <div className="mb-6">
          <p className="mt-4">
            <strong className="font-medium">Name:</strong> {branchData.name}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">University Details</h3>

          <p>
            <strong className="font-medium">University Name:</strong>{" "}
            {branchData.university.name}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Branch Description</h3>
          <p
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: branchData.description }}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Program Details</h3>

          <p>
            <strong className="font-medium">Program Name:</strong>{" "}
            {branchData.program.name}
          </p>
          <p>
            <strong className="font-medium">Program Description:</strong>{" "}
            <span
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: branchData.program.description,
              }}
            />
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">Created At</h3>
          <p>{new Date(branchData.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BranchPage;
