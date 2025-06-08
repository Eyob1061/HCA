import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid 
} from '@mui/material';
import { 
  Dashboard,
  PersonAdd,
  AssignmentInd,
  EventNote,
  People,
  LocalHospital
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import './ReceptionistD.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/receptionist', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/receptionist')
    },
    { 
      label: 'Register Patient', 
      path: '/dashboard/receptionist/register-patient', 
      icon: <PersonAdd />,
      onClick: () => navigate('/dashboard/receptionist/register-patient')
    },
    { 
      label: 'Assign Physician', 
      path: '/dashboard/receptionist/assign-physician', 
      icon: <AssignmentInd />,
      onClick: () => navigate('/dashboard/receptionist/assign-physician')
    }
  ];

  // Example statistics
  const stats = {
    totalPatients: 150,
    todayAppointments: 12,
    pendingAssignments: 5,
    availablePhysicians: 8
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Receptionist Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Receptionist Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h4">
                {stats.totalPatients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Appointments
              </Typography>
              <Typography variant="h4">
                {stats.todayAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Assignments
              </Typography>
              <Typography variant="h4">
                {stats.pendingAssignments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Physicians
              </Typography>
              <Typography variant="h4">
                {stats.availablePhysicians}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    • New patient registered - 10 minutes ago
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    • Physician assigned to Patient ID#123 - 1 hour ago
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    • Appointment scheduled for John Doe - 2 hours ago
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;