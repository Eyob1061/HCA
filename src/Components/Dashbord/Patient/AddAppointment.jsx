import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    physicianUsername: '',
    date: '',
    time: '',
    reason: ''
  });
  const [physicians, setPhysicians] = useState([]);

  useEffect(() => {
    const fetchPhysicians = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const response = await fetch('http://localhost:5000/api/appointments/physicians', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setPhysicians(data.data);
    };
    fetchPhysicians();
  }, []);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.reason.length < 10) {
      return 'Reason for visit must be at least 10 characters long.';
    }
    
    if (!formData.time) {
      return 'Please select a time for your appointment.';
    }
    
    if (!formData.date) {
      return 'Please select a date for your appointment.';
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare only dates
    
    if (selectedDate < today) {
      return 'Cannot schedule appointments in the past. Please select today or a future date.';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        throw new Error('Please log in to schedule an appointment.');
      }
      
      const token = user.token;
      const payload = { 
        ...formData,
        // Ensure date is in YYYY-MM-DD format
        date: formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''
      };
      
      console.log('Sending appointment request:', payload);
      
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server responded with error:', data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      alert('Appointment scheduled successfully!');
      setFormData({ department: '', physicianUsername: '', date: '', time: '', reason: '' });
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      alert(`Failed to schedule appointment: ${err.message}`);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Patient Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Schedule New Appointment
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="General Medicine">General Medicine</MenuItem>
                    <MenuItem value="Blood Test">Blood Test</MenuItem>
                    <MenuItem value="Diabetis Test">Diabetis Test</MenuItem>
                    <MenuItem value="Cancer Test">Cancer Test</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="physicianUsername"
                    value={formData.physicianUsername}
                    onChange={handleChange}
                    required
                  >
                    {physicians.map((doc) => (
                      <MenuItem key={doc.username} value={doc.username}>
                        {doc.fullName || doc.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
                  required
                />
                {formData.date && new Date(formData.date) < new Date().setHours(0, 0, 0, 0) && (
                  <Typography color="error" variant="caption">
                    Cannot select a past date
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Time</InputLabel>
                  <Select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    {Array.from({ length: 18 }, (_, i) => {
                      // Generate time slots from 8:00 AM to 5:00 PM in 30-minute increments
                      const hour = Math.floor(i / 2) + 8;
                      const minute = (i % 2) * 30;
                      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      const time12 = new Date(`2000-01-01T${time24}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                      
                      return (
                        <MenuItem key={time24} value={time24}>
                          {time12}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
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
                  Schedule Appointment
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddAppointment; 