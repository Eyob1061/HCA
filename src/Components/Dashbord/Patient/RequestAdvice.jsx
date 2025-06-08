import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const RequestAdvice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    urgency: 'medium'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('Please login to request advice');
        navigate('/login');
        return;
      }

      // Create notification for advice request
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          type: 'advice',
          title: 'New Advice Request',
          message: `Patient ${user.name} is requesting medical advice`,
          urgency: formData.urgency,
          targetRole: 'physician',
          metadata: {
            patientId: user._id,
            patientName: user.name,
            subject: formData.subject,
            description: formData.description,
            urgency: formData.urgency
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit advice request');
      }

      toast.success('Advice request submitted successfully!');
      setFormData({
        subject: '',
        description: '',
        urgency: 'medium'
      });
    } catch (error) {
      console.error('Error submitting advice request:', error);
      toast.error('Failed to submit advice request. Please try again.');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Request Medical Advice
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your concern"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  placeholder="Please provide detailed information about your medical concern..."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="low">Low - Not Urgent</MenuItem>
                    <MenuItem value="medium">Medium - Standard Priority</MenuItem>
                    <MenuItem value="high">High - Urgent</MenuItem>
                    <MenuItem value="emergency">Emergency - Immediate Attention Required</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RequestAdvice; 