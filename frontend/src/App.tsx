import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyApplications from "./pages/MyApplication";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import JobApplications from "./pages/JobApplications";
import UserProfile from "./pages/UserProfile";
import MyProfile from "./pages/MyProfile";
import CompanyProfile from "./pages/CompanyProfile";
import AskAI from "./pages/AskAI";
import CreateCompany from "./pages/CreateCompany";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/companies/:companyId" element={<CompanyProfile />} />

        {/* Protected Routes */}
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/ask-ai" element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
        <Route path="/users/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* Recruiter Only Routes */}
        <Route path="/create-job" element={<ProtectedRoute roles={['recruiter']}><CreateJob /></ProtectedRoute>} />
        <Route path="/create-company" element={<ProtectedRoute roles={['recruiter']}><CreateCompany /></ProtectedRoute>} /> {/* Add this route */}
        <Route path="/my-jobs" element={<ProtectedRoute roles={['recruiter']}><MyJobs /></ProtectedRoute>} />
        <Route path="/jobs/:jobId/applications" element={<ProtectedRoute roles={['recruiter']}><JobApplications /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;