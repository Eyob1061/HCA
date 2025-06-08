import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const ApproveRecommendations = () => {
  const navigate = useNavigate();
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchAdvices = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await fetch('http://localhost:5000/api/advice', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setAdvices(data.data || []);
        } else {
          setAdvices([]);
        }
      } catch (err) {
        setAdvices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvices();
  }, []);

  const handleApprove = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    await fetch(`http://localhost:5000/api/advice/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setAdvices(advices.map(a => a._id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    await fetch(`http://localhost:5000/api/advice/${id}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setAdvices(advices.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Approve Recommendations
      </Typography>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={3}>
          {advices.map((advice) => (
            <Grid item xs={12} key={advice._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" gutterBottom>
                        {advice.condition}
                        <Chip
                          label={advice.status}
                          color={
                            advice.status === 'approved' ? 'success' : 
                            advice.status === 'rejected' ? 'error' : 
                            'default'
                          }
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {advice.createdAt ? advice.createdAt.substring(0, 10) : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Patient ID"
                            secondary={advice.patientId && advice.patientId.patientId ? advice.patientId.patientId : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Patient Name"
                            secondary={advice.patientId && advice.patientId.fullName ? advice.patientId.fullName : ''}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Medications"
                            secondary={advice.medications}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    {advice.status === 'pending' && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<ThumbUp />}
                            onClick={() => handleApprove(advice._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<ThumbDown />}
                            onClick={() => handleReject(advice._id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Grid>
                    )}
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

export default ApproveRecommendations; 