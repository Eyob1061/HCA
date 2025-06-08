import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import { 
  Dashboard,
  EventNote,
  Comment,
  Feedback,
  Assignment,
  MedicalServices
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import { useAuth } from '../../Auth/AuthContext';
import './PatientD.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context

  const [patientData, setPatientData] = useState({
    notifications: [],
    upcomingAppointments: 0, // Placeholder
    newRecommendations: 0, // Placeholder
    completedVisits: 0, // Placeholder
    pendingRequests: 0 // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for the patient dashboard
  const fetchPatientData = async () => {
    if (!user || !user.token) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch notifications for the current user
      const notificationsResponse = await fetch(`http://localhost:5000/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!notificationsResponse.ok) {
        const errorData = await notificationsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }

      const notificationsData = await notificationsResponse.json();

      if (notificationsData.success) {
        const notifications = notificationsData.data;

        // Filter notifications to get pending advice requests
        const pendingRequests = notifications.filter(notif => 
            notif.type === 'advice_request' && notif.status === 'unread'
        ).length;

        // Sort notifications by creation date for recent activity
        const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPatientData(prevState => ({
          ...prevState,
          notifications: sortedNotifications,
          pendingRequests: pendingRequests,
           // TODO: Fetch actual data for appointments, recommendations, completed visits
        }));

      } else {
         setError(notificationsData.error || 'Failed to fetch notifications.');
      }

    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(err.message || 'Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [user]); // Refetch if user changes (e.g., after login/logout)

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/patient', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/patient')
    },
    { 
      label: 'Request Advice', 
      path: '/dashboard/patient/request-advice', 
      icon: <MedicalServices />,
      onClick: () => navigate('/dashboard/patient/request-advice')
    },
    { 
      label: 'Add Appointment', 
      path: '/dashboard/patient/add-appointment', 
      icon: <EventNote />,
      onClick: () => navigate('/dashboard/patient/add-appointment')
    },
    { 
      label: 'View Recommendations', 
      path: '/dashboard/patient/recommendations', 
      icon: <Assignment />,
      onClick: () => navigate('/dashboard/patient/recommendations')
    },
    { 
      label: 'Give Feedback', 
      path: '/dashboard/patient/feedback', 
      icon: <Feedback />,
      onClick: () => navigate('/dashboard/patient/feedback')
    }
  ];

  const renderRecentActivityItem = (notification) => {
    // Display different content based on notification type
    switch (notification.type) {
      case 'advice_request':
        return (
          <Typography variant="body1" color="text.secondary" key={notification._id}>
            • Advice Request Submitted: {notification.metadata?.subject} - {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        );
      case 'feedback':
        return (
          <Typography variant="body1" color="text.secondary" key={notification._id}>
            • Feedback Submitted for Dr. {notification.metadata?.doctorName} - {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        );
        case 'system_alert':
          return (
            <Typography variant="body1" color="text.secondary" key={notification._id}>
              • System Alert: {notification.message} - {new Date(notification.createdAt).toLocaleDateString()}
            </Typography>
          );
      // Add cases for other notification types relevant to patient dashboard activity
      default:
        return (
          <Typography variant="body1" color="text.secondary" key={notification._id}>
            • New Activity: {notification.title} - {new Date(notification.createdAt).toLocaleDateString()}
          </Typography>
        );
    }
  };


  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Patient Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Dashboard Data...</Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" align="center">Error: {error}</Typography>
      ) : (
        <Grid container spacing={4}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Appointments
                </Typography>
                <Typography variant="h4">
                  {patientData.upcomingAppointments} {/* Display fetched count */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Requests
                </Typography>
                <Typography variant="h4">
                  {patientData.pendingRequests} {/* Display fetched count of advice requests */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  New Recommendations
                </Typography>
                <Typography variant="h4">
                  {patientData.newRecommendations} {/* Display fetched count */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Completed Visits
                </Typography>
                <Typography variant="h4">
                  {patientData.completedVisits} {/* Display fetched count */}
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
                   {patientData.notifications.length === 0 ? (
                    <Grid item xs={12}>
                       <Typography variant="body1" color="text.secondary">
                         No recent activity.
                       </Typography>
                    </Grid>
                   ) : (
                    patientData.notifications.slice(0, 5).map(notification => renderRecentActivityItem(notification))
                   )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;