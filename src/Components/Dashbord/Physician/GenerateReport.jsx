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
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Save
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    followUpDate: '',
    notes: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientId: formData.patientId,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        prescription: formData.prescription,
        followUpDate: formData.followUpDate,
        notes: formData.notes
      };
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const response = await fetch('http://localhost:5000/api/patient-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate report');
      }
      alert('Report generated successfully!');
      setFormData({
        patientId: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        followUpDate: '',
        notes: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        Generate Patient Report
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Patient ID"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Plan"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prescription"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Follow-up Date"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
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
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default GenerateReport; 