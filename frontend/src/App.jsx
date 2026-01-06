import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import {
  SkillManagement,
  Assessment,
  AssessmentResult,
  GapAnalysis,
  CareerPath,
  JobSearch,
  CreateJob,
  Candidates,
  TeamRisk,
  Analytics
} from './pages/PlaceholderPages';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'} replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          <Navigate to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/skills" element={
        <ProtectedRoute requiredRole="student">
          <SkillManagement />
        </ProtectedRoute>
      } />
      <Route path="/student/assessment/:skillId" element={
        <ProtectedRoute requiredRole="student">
          <Assessment />
        </ProtectedRoute>
      } />
      <Route path="/student/assessment-result" element={
        <ProtectedRoute requiredRole="student">
          <AssessmentResult />
        </ProtectedRoute>
      } />
      <Route path="/student/gap-analysis" element={
        <ProtectedRoute requiredRole="student">
          <GapAnalysis />
        </ProtectedRoute>
      } />
      <Route path="/student/career-path" element={
        <ProtectedRoute requiredRole="student">
          <CareerPath />
        </ProtectedRoute>
      } />
      <Route path="/student/jobs" element={
        <ProtectedRoute requiredRole="student">
          <JobSearch />
        </ProtectedRoute>
      } />

      {/* Company Routes */}
      <Route path="/company/dashboard" element={
        <ProtectedRoute requiredRole="company">
          <CompanyDashboard />
        </ProtectedRoute>
      } />
      <Route path="/company/create-job" element={
        <ProtectedRoute requiredRole="company">
          <CreateJob />
        </ProtectedRoute>
      } />
      <Route path="/company/candidates/:jobId" element={
        <ProtectedRoute requiredRole="company">
          <Candidates />
        </ProtectedRoute>
      } />
      <Route path="/company/team-risk" element={
        <ProtectedRoute requiredRole="company">
          <TeamRisk />
        </ProtectedRoute>
      } />
      <Route path="/company/analytics" element={
        <ProtectedRoute requiredRole="company">
          <Analytics />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

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
