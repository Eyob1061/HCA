import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid 
} from '@mui/material';
import { 
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Assignment
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import './PhysicianD.css';

const PhysicianDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    pendingReports: 0,
    pendingRecommendations: 0,
    recentActivity: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const response = await fetch('http://localhost:5000/api/physician-dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    };
    fetchStats();
  }, []);

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/physician', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/physician')
    },
    { 
      label: 'Generate Report', 
      path: '/dashboard/physician/generate-report', 
      icon: <Description />,
      onClick: () => navigate('/dashboard/physician/generate-report')
    },
    { 
      label: 'Insert Advice', 
      path: '/dashboard/physician/insert-advice', 
      icon: <MedicalServices />,
      onClick: () => navigate('/dashboard/physician/insert-advice')
    },
    { 
      label: 'Approve Recommendations', 
      path: '/dashboard/physician/approve-recommendations', 
      icon: <CheckCircle />,
      onClick: () => navigate('/dashboard/physician/approve-recommendations')
    },
    { 
      label: 'View Patients', 
      path: '/dashboard/physician/view-patients', 
      icon: <People />,
      onClick: () => navigate('/dashboard/physician/view-patients')
    },
    { 
      label: 'View Appointments', 
      path: '/dashboard/physician/view-appointments', 
      icon: <EventNote />,
      onClick: () => navigate('/dashboard/physician/view-appointments')
    },
    { 
      label: 'Update Patient Data', 
      path: '/dashboard/physician/update-patient', 
      icon: <Edit />,
      onClick: () => navigate('/dashboard/physician/update-patient')
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Dashboard">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Physician Dashboard
      </Typography>

      <Grid container spacing={3}>
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
                {stats.todaysAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fffde7' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Reports
              </Typography>
              <Typography variant="h4">
                {stats.pendingReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Recommendations
              </Typography>
              <Typography variant="h4">
                {stats.pendingRecommendations}
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
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Typography variant="body1" color="text.secondary">
                        {activity.status === 'approved' ? 'Approved recommendation' : 'Submitted advice'} for Patient #{activity.patientId?.patientId || ''} - {new Date(activity.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      No recent activity.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default PhysicianDashboard;