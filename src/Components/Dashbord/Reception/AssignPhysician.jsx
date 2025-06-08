import React, { useState } from 'react';
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
  Box,
} from '@mui/material';
import {
  Dashboard,
  PersonAdd,
  AssignmentInd,
  Save
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const AssignPhysician = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    physicianId: '',
    department: '',
    priority: 'normal',
    notes: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Physician assignment form submitted:', formData);
    // Add API call here
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Receptionist Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Assign Physician to Patient
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patient ID"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="general">General Medicine</MenuItem>
                    <MenuItem value="cardiology">Heart disease</MenuItem>
                    <MenuItem value="orthopedics">Cancer</MenuItem>
                    <MenuItem value="pediatrics">Mental health disorders</MenuItem>
                    <MenuItem value="neurology">Diabetes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Physician</InputLabel>
                  <Select
                    name="physicianId"
                    value={formData.physicianId}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="dr-smith">Dr. Abebe (General Medicine)</MenuItem>
                    <MenuItem value="dr-johnson">Dr. Bahru (Cancer)</MenuItem>
                    <MenuItem value="dr-williams">Dr. Liya (Diabetes)</MenuItem>
                    <MenuItem value="dr-brown">Dr. Afwork (Heart disease)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<Save />}
                >
                  Assign Physician
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AssignPhysician; 