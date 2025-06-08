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
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import {
  Dashboard,
  PersonAdd,
  AssignmentInd,
  Save
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    insuranceInfo: ''
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
    console.log('Patient registration form submitted:', formData);
    // Add API call here
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Receptionist Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Register New Patient
      </Typography>

      <Card sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Insurance Information"
                  name="insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical History"
                  name="medicalHistory"
                  value={formData.medicalHistory}
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
                  Register Patient
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RegisterPatient; 