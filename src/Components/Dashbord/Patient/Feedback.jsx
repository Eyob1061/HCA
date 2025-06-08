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

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceType: '',
    doctorName: '',
    visitDate: '',
    rating: '',
    comments: ''
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
      if (!user || !user.token) {
        toast.error('Please login to submit feedback');
        navigate('/login');
        return;
      }

      // Create notification for feedback
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          type: 'feedback',
          title: 'New Patient Feedback',
          message: `Patient ${user.name} has submitted feedback`,
          targetRole: 'admin',
          metadata: {
            patientId: user._id,
            patientName: user.name,
            serviceType: formData.serviceType,
            doctorName: formData.doctorName,
            visitDate: formData.visitDate,
            rating: formData.rating,
            comments: formData.comments
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      toast.success('Feedback submitted successfully!');
      setFormData({
        serviceType: '',
        doctorName: '',
        visitDate: '',
        rating: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message || 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Give Feedback
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="consultation">Consultation</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="surgery">Surgery</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Doctor Name"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Visit Date"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="1">1 - Poor</MenuItem>
                    <MenuItem value="2">2 - Fair</MenuItem>
                    <MenuItem value="3">3 - Good</MenuItem>
                    <MenuItem value="4">4 - Very Good</MenuItem>
                    <MenuItem value="5">5 - Excellent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  placeholder="Please share your experience..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FeedbackForm; 