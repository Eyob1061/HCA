import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';
import {
  Dashboard,
  EventNote,
  Comment,
  Feedback,
  Assignment,
  MedicalServices,
  CheckCircle,
  Schedule,
  LocalHospital,
  DoneAll,
  InfoOutlined
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import { useAuth } from '../../Auth/AuthContext';

const Recommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [approvedAdvice, setApprovedAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchApprovedAdvice = async () => {
    if (!user || !user.token) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/advice/patient`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch approved advice');
      }

      const data = await response.json();

      if (data.success) {
        const sortedAdvice = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApprovedAdvice(sortedAdvice);
      } else {
         setError(data.message || 'Failed to fetch approved advice.');
      }

    } catch (err) {
      console.error('Error fetching approved advice:', err);
      setError(err.message || 'Failed to fetch approved advice.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedAdvice();
  }, [user]);

  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Medical Recommendations (Approved Advice)
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading recommendations...</Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" align="center">Error: {error}</Typography>
      ) : approvedAdvice.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">No approved advice found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {approvedAdvice.map((advice) => (
            <Grid item xs={12} key={advice._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Advice: {advice.condition}
                        <Chip
                          label="Approved"
                          color="success"
                          size="small"
                          icon={<DoneAll />}
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                    </Grid>

                    {advice.medications && (
                     <Grid item xs={12}>
                       <List>
                           <ListItem>
                            <ListItemIcon>
                              <LocalHospital />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Medications"
                              secondary={advice.medications}
                            />
                          </ListItem>
                       </List>
                     </Grid>
                    )}

                    {advice.lifestyle && (
                       <Grid item xs={12}>
                       <List>
                           <ListItem>
                             <ListItemIcon>
                               <CheckCircle />
                             </ListItemIcon>
                             <ListItemText 
                               primary="Lifestyle Recommendations"
                               secondary={advice.lifestyle}
                             />
                           </ListItem>
                        </List>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                       <List>
                          <ListItem>
                            <ListItemIcon>
                              <Schedule />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Date Approved"
                              secondary={new Date(advice.updatedAt).toLocaleDateString()}
                            />
                          </ListItem>
                       </List>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Recommendations; 