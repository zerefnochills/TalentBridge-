import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import SkillManagement from "./pages/student/SkillManagement";
import Assessment from "./pages/student/Assessment";
import AssessmentResult from "./pages/student/AssessmentResult";
import GapAnalysis from "./pages/student/GapAnalysis";
import CareerPath from "./pages/student/CareerPath";
import Jobs from "./pages/student/Jobs";
import JobDetails from "./pages/student/JobDetails";
import AITutor from "./pages/student/AITutor";
import Navigator from "./pages/student/Navigator";

// Company Pages
import CompanyDashboard from "./pages/company/Dashboard";
import CreateJob from "./pages/company/CreateJob";
import Candidates from "./pages/company/Candidates";
import TeamRisk from "./pages/company/TeamRisk";
import Analytics from "./pages/company/Analytics";

// Components
import SCI from "./components/SCI";

/* =======================
   Protected Route
======================= */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to={user.role === "student" ? "/student/dashboard" : "/company/dashboard"}
        replace
      />
    );
  }

  return children;
};

/* =======================
   Routes
======================= */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === "student" ? "/student/dashboard" : "/company/dashboard"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/skills"
        element={
          <ProtectedRoute requiredRole="student">
            <SkillManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assessment/:skillId"
        element={
          <ProtectedRoute requiredRole="student">
            <Assessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assessment-result"
        element={
          <ProtectedRoute requiredRole="student">
            <AssessmentResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/gap-analysis"
        element={
          <ProtectedRoute requiredRole="student">
            <GapAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/career-path"
        element={
          <ProtectedRoute requiredRole="student">
            <CareerPath />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute requiredRole="student">
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/jobs/:jobId"
        element={
          <ProtectedRoute requiredRole="student">
            <JobDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/ai-tutor"
        element={
          <ProtectedRoute requiredRole="student">
            <AITutor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/navigator"
        element={
          <ProtectedRoute requiredRole="student">
            <Navigator />
          </ProtectedRoute>
        }
      />

      {/* SCI Calculator */}
      <Route
        path="/student/sci"
        element={
          <ProtectedRoute requiredRole="student">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 p-6">
              <h1 className="text-3xl font-bold text-center mb-6">Skill Confidence Index Calculator</h1>
              <SCI />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/create-job"
        element={
          <ProtectedRoute requiredRole="company">
            <CreateJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/candidates/:jobId"
        element={
          <ProtectedRoute requiredRole="company">
            <Candidates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/team-risk"
        element={
          <ProtectedRoute requiredRole="company">
            <TeamRisk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/analytics"
        element={
          <ProtectedRoute requiredRole="company">
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

/* =======================
   App Wrapper
======================= */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
