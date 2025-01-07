import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdmissionLeads from "./pages/AdmissionLeads/AdmissionLeads";
import Enquiries from "./pages/Enquiries/Enquiries";
import Complaints from "./pages/Complaints/Complaints";
import AppliedInstructors from "./pages/AppliedInstructors/AppliedInstructors";
import UniversityList from "./pages/AddUniversity/UniversityList";
import Programs from "./pages/Programs/Programs";
import PrgramsBranch from "./pages/ProdramsBranch/ProdramsBranch";

import UniversityLogin from "./pagesuniversity/Login";
import UniversityDashboard from "./pagesuniversity/Dashboard";
import UniversityEnquiries from "./pagesuniversity/Enquiries";
import UniversityAdmissionLeads from "./pagesuniversity/Admissionleads";

// Mock authentication function
const isAuthenticated = () => {
  return localStorage.getItem("AharadaadminauthToken") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Add Route for Admission Leads */}
        <Route
          path="/admin/admission-leads"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdmissionLeads />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enquiries"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Enquiries />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Complaints />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applied-instructors"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AppliedInstructors />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/list-university"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UniversityList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/list-Programs/:universityId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Programs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/program/:programId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PrgramsBranch />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/university/login/admin" element={<UniversityLogin />} />
        <Route
          path="/university/dashboard/admin"
          element={<UniversityDashboard />}
        />
        <Route
          path="/university/enquiries/admin"
          element={<UniversityEnquiries />}
        />
        <Route
          path="/university/admissionleads/admin"
          element={<UniversityAdmissionLeads />}
        />
      </Routes>
    </Router>
  );
};

export default App;
