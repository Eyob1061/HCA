import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Components/Auth/AuthContext';
import { getUserPermissions } from './Components/Auth/passwords';
import Home from './Components/Home/Home';
import Login from './Components/Home/Login';
import AdminDashboard from './Components/Dashbord/Admin/AdminDashboard/';
import UserManagement from './Components/Dashbord/Admin/UserManagement/UserManagement';
import UserList from './Components/Dashbord/Admin/UserList/UserList';
import Settings from './Components/Dashbord/Admin/Settings/Settings';
import PatientDashboard from './Components/Dashbord/Patient/PatientDashboard';
import PhysicianDashboard from './Components/Dashbord/Physician/PhysicianDashboard';
import RequestAdvice from './Components/Dashbord/Patient/RequestAdvice';
import AddAppointment from './Components/Dashbord/Patient/AddAppointment';
import Recommendations from './Components/Dashbord/Patient/Recommendations';
import Feedback from './Components/Dashbord/Patient/Feedback';
import GenerateReport from './Components/Dashbord/Physician/GenerateReport';
import InsertAdvice from './Components/Dashbord/Physician/InsertAdvice';
import ApproveRecommendations from './Components/Dashbord/Physician/ApproveRecommendations';
import ViewPatients from './Components/Dashbord/Physician/ViewPatients';
import ViewAppointments from './Components/Dashbord/Physician/ViewAppointments';
import UpdatePatient from './Components/Dashbord/Physician/UpdatePatient';
import RegisterPatient from './Components/Dashbord/Physician/RegisterPatient';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    console.log('No authenticated user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return children;
};

function App() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState(null);
  const location = useLocation();

  // Log authentication state for debugging
  useEffect(() => {
    console.log('Auth state in App:', { user, authLoading });
  }, [user, authLoading]);

  // Show loading indicator while authentication is initializing
  if (authLoading) {
    return <div className="app-loading">Loading application...</div>;
  }

  // Show error if there's an error
  if (error) {
    return <div className="app-error">Error: {error.message}</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Routes>
            <Route path="admin/*" element={
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="user-list" element={<UserList />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            } />
            <Route path="patient/*" element={
              <Routes>
                <Route index element={<PatientDashboard />} />
                <Route path="request-advice" element={<RequestAdvice />} />
                <Route path="add-appointment" element={<AddAppointment />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="feedback" element={<Feedback />} />
              </Routes>
            } />
            <Route path="physician/*" element={
              <Routes>
                <Route index element={<PhysicianDashboard />} />
                <Route path="generate-report" element={<GenerateReport />} />
                <Route path="insert-advice" element={<InsertAdvice />} />
                <Route path="approve-recommendations" element={<ApproveRecommendations />} />
                <Route path="view-patients" element={<ViewPatients />} />
                <Route path="view-appointments" element={<ViewAppointments />} />
                <Route path="register-patient" element={<RegisterPatient />} />
                <Route path="update-patient" element={<UpdatePatient />} />
              </Routes>
            } />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Redirect /patients to the correct dashboard route */}
      <Route path="/patients" element={<Navigate to="/dashboard/physician/view-patients" replace />} />

      {/* Catch all route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;