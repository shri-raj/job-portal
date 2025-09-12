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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute roles={['recruiter']}>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute roles={['recruiter']}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId/applications"
          element={
            <ProtectedRoute roles={['recruiter']}>
              <JobApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;