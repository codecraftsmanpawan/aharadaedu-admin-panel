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
import VideoFeedbackForm from "./pages/Videofeedbacks/Vdeofeedbacks";
import TestimonialForm from "./pages/Testimonials/Testimonials";
import CollaboratorsList from "./pages/Collaborators/Collaborators";
import FacultyMembers from "./pages/Faculty/FacultyMembers";
import FacultyMembersDetails from "./pages/Faculty/FacultyMembersDetails";
import AddFacultyMembers from "./pages/Faculty/AddFacultyMembers";
import PlacementTeams from "./pages/PlacementTeams/PlacementTeams";
import PlacedStudent from "./pages/PlacedStudent/PlacedStudent";
import TeamMember from "./pages/TeamMember/TeamMember";

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
        <Route
          path="/admin/video/feedback"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <VideoFeedbackForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonial"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <TestimonialForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/collaboratorslist"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CollaboratorsList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/facultymembers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <FacultyMembers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faculty/:facultyId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <FacultyMembersDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addfaculty"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddFacultyMembers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/placementteams"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlacementTeams />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/placedstudent"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlacedStudent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teammember"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <TeamMember />
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
