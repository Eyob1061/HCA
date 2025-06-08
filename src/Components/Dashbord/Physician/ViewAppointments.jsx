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
  Divider,
  TextField,
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
  Visibility,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import { getAppointmentsByPhysicianId, getPatientById } from '../../../utils/dataUtils';

const ViewAppointments = () => {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const response = await fetch('http://localhost:5000/api/appointments/physician', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setAppointments(data.data);
      setLoading(false);
    };
    fetchAppointments();
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

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.medicalNotes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setNotes('');
  };

  const handleSaveNotes = () => {
    // Here you would typically make an API call to save the notes
    console.log('Saving notes for appointment:', selectedAppointment.id, notes);
    handleCloseDialog();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'confirmed':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      <Typography variant="h4" className="dashboard-title" gutterBottom>
        View Appointments
      </Typography>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appt) => (
            <Grid item xs={12} key={appt._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {appt.department} Appointment
                  </Typography>
                  <Typography variant="body1">
                    Patient: {appt.patientId?.fullName} ({appt.patientId?.patientId})
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(appt.date).toLocaleDateString()}<br />
                    Time: {appt.time}<br />
                    Reason: {appt.reason}<br />
                    Status: {appt.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Appointment Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <CalendarToday color="primary" />
                </Grid>
                <Grid item>
                  Appointment Details
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Patient Name" 
                        secondary={selectedAppointment.patientName} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Patient ID" 
                        secondary={selectedAppointment.patientId} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Contact" 
                        secondary={selectedAppointment.contact} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedAppointment.email} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <ListItemText 
                          primary="Appointment Date" 
                          secondary={selectedAppointment.date} 
                        />
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <ListItemText 
                          primary="Appointment Time" 
                          secondary={selectedAppointment.time} 
                        />
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Reason for Visit" 
                        secondary={selectedAppointment.reason} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Previous Visit" 
                        secondary={selectedAppointment.previousVisit} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical Notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleSaveNotes}
                variant="contained"
                color="primary"
              >
                Save Notes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default ViewAppointments; 