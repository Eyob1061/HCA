import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Visibility,
  LocalHospital
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import { useAuth } from '../../Auth/AuthContext';

const ViewPatients = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading || !user?.token) return;
    const fetchPatients = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching patients with token:', user.token);
        const response = await fetch('http://localhost:5000/api/users/patients', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        if (!response.ok) {
          console.error('Error response from backend:', data);
          throw new Error(data.message || 'Failed to fetch patients');
        }
        console.log('Fetched patients:', data.data);
        // Normalize patients to always have _id
        const normalizedPatients = (data.data || []).map(p => ({
          ...p,
          _id: p._id || p.id
        }));
        setPatients(normalizedPatients);
      } catch (err) {
        console.error('Error in fetchPatients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [authLoading, user?.token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      label: 'Register/Update Patient', 
      path: '/dashboard/physician/register-patient', 
      icon: <Edit />, 
      onClick: () => navigate('/dashboard/physician/register-patient') 
    }
  ];

  const handleViewDetails = (patient) => {
    console.log('Viewing patient:', patient);
    setSelectedPatient({
      ...patient,
      medicalHistory: patient.medicalHistory || [],
      currentMedications: patient.currentMedications || []
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleUpdatePatient = (patient) => {
    console.log('Updating patient:', patient);
    if (!patient._id) {
      setError('Invalid patient ID');
      return;
    }
    navigate('/dashboard/physician/register-patient', { 
      state: { patient } 
    });
  };

  const handleDeletePatient = async (patientId) => {
    // Always use _id, even if passed id
    const patientObj = patients.find(p => p._id === patientId || p.id === patientId);
    const realId = patientObj?._id || patientObj?.id;
    if (!realId) {
      setError('Invalid patient ID');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      console.log('Attempting to delete patient with ID:', realId);
      const response = await fetch(`http://localhost:5000/api/users/${realId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Delete response:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete patient');
      }
      // Remove the deleted patient from the list
      setPatients(patients.filter(p => p._id !== realId));
      setSuccess('Patient deleted successfully');
      // Refresh the patients list
      const refreshResponse = await fetch('http://localhost:5000/api/users/patients', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        const normalizedPatients = (refreshData.data || []).map(p => ({
          ...p,
          _id: p._id || p.id
        }));
        setPatients(normalizedPatients);
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(err.message || 'Failed to delete patient. Please try again.');
    }
  };

  if (authLoading || loading || !user?.token) return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <div>Loading...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        View Patients
      </Typography>
      {error ? (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
      ) : null}
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>
      ) : null}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => {
                  console.log('Rendering patient:', patient);
                  return (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.patientId}</TableCell>
                      <TableCell>{patient.fullName}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : ''}</TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.status} 
                          color={patient.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(patient)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          startIcon={<Edit />}
                          onClick={() => handleUpdatePatient(patient)}
                          sx={{ mr: 1 }}
                        >
                          Update
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            console.log('Delete clicked for patient:', patient);
                            if (patient._id) {
                              handleDeletePatient(patient._id);
                            } else {
                              setError('Invalid patient ID');
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <LocalHospital color="primary" />
                </Grid>
                <Grid item>
                  Patient Details - {selectedPatient.fullName}
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Patient ID" 
                        secondary={selectedPatient.patientId} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Contact" 
                        secondary={selectedPatient.contact} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedPatient.email} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Address" 
                        secondary={selectedPatient.address} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Medical History
                  </Typography>
                  <List>
                    {selectedPatient.medicalHistory.map((item, index) => (
                      <ListItem key={`medical-history-${index}`}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6" gutterBottom>
                    Current Medications
                  </Typography>
                  <List>
                    {selectedPatient.currentMedications.map((med, index) => (
                      <ListItem key={`medication-${index}`}>
                        <ListItemText primary={med} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                startIcon={<Edit />}
                variant="contained"
                onClick={() => handleUpdatePatient(selectedPatient)}
              >
                Update Patient
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default ViewPatients; 