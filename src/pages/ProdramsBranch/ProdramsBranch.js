import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBranch from "./AddBranch";
import base_url from "../../config";

const ProgramDetails = () => {
  const { programId } = useParams();
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const token = localStorage.getItem("AharadaadminauthToken");

  useEffect(() => {
    const fetchProgramData = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${base_url}/api/branches/program/${programId}/branches`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.request(config);

        if (response.status === 200) {
          setProgramData(response.data);
          if (!response.data.branches || response.data.branches.length === 0) {
            setMessage(
              response.data.message || "No branches available for this program."
            );
          }
        }
      } catch (err) {
        if (err.response) {
          const errorMsg =
            err.response.data.message || "Error fetching program data";
          setMessage(errorMsg);
        } else {
          setError("Failed to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [programId, token]);

  const handleDeleteBranch = async () => {
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${base_url}/api/branches/${branchToDelete.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success("Branch deleted successfully");
        setProgramData((prevData) => ({
          ...prevData,
          branches: prevData.branches.filter(
            (branch) => branch.id !== branchToDelete.id
          ),
        }));
      }
    } catch (err) {
      toast.error("Error deleting branch");
    } finally {
      setIsDeleteConfirmationOpen(false);
      setBranchToDelete(null);
    }
  };

  const handleAddBranch = (newBranch) => {
    setProgramData((prev) => ({
      ...prev,
      branches: [...prev.branches, newBranch],
    }));
  };

  const openBranchDetails = (branchId) => {
    window.location.href = `/admin/branch/${branchId}`;
  };

  // Display loading or error state
  if (loading) return <div>Loading...</div>;

  const { university, branches, program, universityId } = programData || {};

  return (
    <div className="container mx-auto p-6">
      {/* University Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {university} Programs and Branches List
        </h1>
        <button
          onClick={() => setIsAddBranchModalOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Branch
        </button>
      </div>

      {/* Program Details */}
      {program && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {program.name} ({program.shortname})
          </h2>
          <p className="text-gray-600 mb-4">{program.description}</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <strong>Full-Time Program Duration:</strong>{" "}
              {program.yearFullTimeProgram} years
            </div>
            <div>
              <strong>Internship Duration:</strong>{" "}
              {program.monthsOfInternships} months
            </div>
          </div>
          {(program.specialisationsOffered?.length > 0 ||
            program.capstoneProjects?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {program.specialisationsOffered?.length > 0 && (
                <div>
                  <strong>Specialisations Offered:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {program.specialisationsOffered.map(
                      (specialization, index) => (
                        <li key={index} className="text-gray-600">
                          {specialization}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {program.capstoneProjects?.length > 0 && (
                <div>
                  <strong>Capstone Projects:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {program.capstoneProjects.map((project, index) => (
                      <li key={index} className="text-gray-600">
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Branches Cards or Message */}
      {branches?.length > 0 ? (
        <div className="container mx-auto p-6">
          <h2 className="text-3xl font-semibold mb-4">Branches</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {branch.name}
                </h3>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openBranchDetails(branch.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setBranchToDelete(branch);
                      setIsDeleteConfirmationOpen(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
        </div>
      )}

      {/* Show AddBranch modal */}
      {isAddBranchModalOpen && (
        <AddBranch
          universityId={universityId}
          programId={programId}
          token={token}
          onClose={() => setIsAddBranchModalOpen(false)}
          onAddBranch={handleAddBranch}
        />
      )}

      {/* Show Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this branch?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteBranch}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProgramDetails;
