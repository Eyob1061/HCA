import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from '../Dashbord/Admin/AdminDashboard';
import ReceptionistDashboard from '../Dashbord/Reception/ReceptionistDashboard';
import PhysicianDashboard from './Physician/PhysicianDashboard';
import PatientDashboard from './Patient/PatientDashboard';

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get('user');

  switch (userType) {
    case 'admin':
      return <AdminDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'physician':
      return <PhysicianDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <div>User type not recognized</div>;
  }
};

export default Dashboard;