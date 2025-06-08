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
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Send
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const InsertAdvice = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    condition: '',
    advice: '',
    medications: '',
    lifestyle: '',
    urgency: 'normal'
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        
        const response = await fetch('http://localhost:5000/api/users/patients', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const data = await response.json();
        setPatients(data.data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        alert('Failed to load patients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
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

  const handlePatientSelect = (e) => {
    const selectedId = e.target.value;
    const selectedPatient = patients.find(p => p._id === selectedId);
    
    setFormData(prev => ({
      ...prev,
      patientId: selectedId,
      patientName: selectedPatient ? selectedPatient.fullName : ''
    }));
    
    console.log('Selected patient:', { id: selectedId, name: selectedPatient?.fullName });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData); // Debug log
      
      if (!formData.patientId) {
        throw new Error('Please select a patient');
      }
      
      const payload = {
        patientId: formData.patientId,
        condition: formData.condition,
        advice: formData.advice,
        medications: formData.medications,
        lifestyle: formData.lifestyle,
        urgencyLevel: formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)
      };
      
      console.log('Submitting payload:', payload); // Debug log
      
      // Get token from user object in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const response = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit advice');
      }
      alert('Advice submitted successfully!');
      setFormData({
        patientId: '',
        condition: '',
        medications: '',
        lifestyle: '',
        urgency: 'normal'
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      {/* Debug Panel - Can be removed in production */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        zIndex: 1000,
        maxWidth: '300px',
        fontSize: '12px'
      }}>
        <div><strong>Current Form Data:</strong></div>
        <pre style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="patient-select-label">Select Patient</InputLabel>
                  <Select
                    labelId="patient-select-label"
                    id="patient-select"
                    name="patientId"
                    value={formData.patientId || ''}
                    onChange={handlePatientSelect}
                    label="Select Patient"
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) return <em>Select a patient</em>;
                      const patient = patients.find(p => p._id === selected);
                      return patient ? `${patient.fullName} (ID: ${patient.patientId || 'N/A'})` : 'Unknown patient';
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a patient</em>
                    </MenuItem>
                    {patients.map((patient) => (
                      <MenuItem key={patient._id} value={patient._id}>
                        <div>
                          <div><strong>{patient.fullName}</strong></div>
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            ID: {patient.patientId || 'N/A'}
                          </div>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div style={{ marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <div><strong>Selected Patient:</strong> {formData.patientName || 'None'}</div>
                  {formData.patientId && (
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      <div>ID: <code>{formData.patientId}</code></div>
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, patientId: '', patientName: '' }));
                        }}
                        sx={{ mt: 1 }}
                      >
                        Change Patient
                      </Button>
                    </div>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    name="urgency"
                    value={formData.urgency}
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
                  label="Medical Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical Advice"
                  name="advice"
                  value={formData.advice}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lifestyle Recommendations"
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<Send />}
                >
                  Submit Advice
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default InsertAdvice; 