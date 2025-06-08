import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Grid, Card, CardContent, Typography } from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';
import { useAuth } from '../../Auth/AuthContext';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const editingPatient = location.state?.patient || null;
  console.log('Editing patient data:', editingPatient);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    age: '',
    condition: '',
    lastVisit: '',
    status: '',
    phone: '',
    address: '',
    patientId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/physician', icon: <Dashboard />, onClick: () => navigate('/dashboard/physician') },
    { label: 'Generate Report', path: '/dashboard/physician/generate-report', icon: <Description />, onClick: () => navigate('/dashboard/physician/generate-report') },
    { label: 'Insert Advice', path: '/dashboard/physician/insert-advice', icon: <MedicalServices />, onClick: () => navigate('/dashboard/physician/insert-advice') },
    { label: 'Approve Recommendations', path: '/dashboard/physician/approve-recommendations', icon: <CheckCircle />, onClick: () => navigate('/dashboard/physician/approve-recommendations') },
    { label: 'View Patients', path: '/dashboard/physician/view-patients', icon: <People />, onClick: () => navigate('/dashboard/physician/view-patients') },
    { label: 'View Appointments', path: '/dashboard/physician/view-appointments', icon: <EventNote />, onClick: () => navigate('/dashboard/physician/view-appointments') },
    { label: 'Register Patient', path: '/dashboard/physician/register-patient', icon: <Edit />, onClick: () => navigate('/dashboard/physician/register-patient') }
  ];

  useEffect(() => {
    if (authLoading || !user?.token) {
      console.log('Auth loading or no user token, skipping fetchPatientsAndGenerateId');
      return;
    }
    if (editingPatient) {
      setFormData({
        ...editingPatient,
        password: '' // Don't show password
      });
      setLoading(false);
    } else {
      // Auto-generate patientId for new patient
      const fetchPatientsAndGenerateId = async () => {
        setLoading(true);
        try {
          console.log('Fetching patients with token:', user.token);
          const response = await fetch('http://localhost:5000/api/users/patients', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          console.log('Response status:', response.status);
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            console.error('Error response from backend:', data);
            throw new Error(data.message || 'Failed to fetch patients');
          }
          const patients = data.data || [];
          // Find max patientId number
          let maxNum = 0;
          patients.forEach(p => {
            if (p.patientId && /^PA\d+$/.test(p.patientId)) {
              const num = parseInt(p.patientId.replace('PA', ''), 10);
              if (num > maxNum) maxNum = num;
            }
          });
          const nextId = 'PA' + String(maxNum + 1).padStart(2, '0');
          setFormData(f => ({ ...f, patientId: nextId }));
        } catch (err) {
          console.error('Error in fetchPatientsAndGenerateId:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPatientsAndGenerateId();
    }
  }, [authLoading, user?.token, editingPatient]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading || !user?.token) {
      setError('Authentication not ready. Please wait.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'patient',
        patientId: formData.patientId,
        age: formData.age,
        condition: formData.condition,
        phone: formData.phone,
        address: formData.address,
        lastVisit: formData.lastVisit,
        status: formData.status || 'Active',
        accountStatus: 'active'
      };

      if (!editingPatient) {
        // Registration: require password
        if (!payload.password) throw new Error('Password is required for new patient registration');
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
          console.error('Server response:', data);
          throw new Error(data.message || 'Failed to register patient');
        }
        setSuccess('Patient registered successfully!');
        // Reset form after successful registration
        setFormData({
          fullName: '',
          username: '',
          email: '',
          password: '',
          age: '',
          condition: '',
          lastVisit: '',
          status: '',
          phone: '',
          address: '',
          patientId: formData.patientId // Keep the same patientId format
        });
        // Fetch new patientId for next registration
        const nextIdResponse = await fetch('http://localhost:5000/api/users/patients', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const nextIdData = await nextIdResponse.json();
        if (nextIdResponse.ok) {
          const patients = nextIdData.data || [];
          let maxNum = 0;
          patients.forEach(p => {
            if (p.patientId && /^PA\d+$/.test(p.patientId)) {
              const num = parseInt(p.patientId.replace('PA', ''), 10);
              if (num > maxNum) maxNum = num;
            }
          });
          const nextId = 'PA' + String(maxNum + 1).padStart(2, '0');
          setFormData(prev => ({ ...prev, patientId: nextId }));
        }
      } else {
        // Update
        const patientId = editingPatient?._id;
        console.log('Editing patient _id for update:', patientId);
        if (!patientId) {
          throw new Error('Invalid patient ID for update. Please try again.');
        }
        const response = await fetch(`http://localhost:5000/api/users/${patientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
          console.error('Update response:', data);
          throw new Error(data.message || 'Failed to update patient');
        }
        setSuccess('Patient updated successfully!');
        // Navigate back to patients list after successful update
        setTimeout(() => {
          navigate('/dashboard/physician/view-patients');
        }, 1500);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
        {editingPatient ? 'Update Patient Information' : 'Register New Patient'}
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {!editingPatient && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="condition"
                  label="Condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="lastVisit"
                  label="Last Visit"
                  type="date"
                  value={formData.lastVisit ? formData.lastVisit.substring(0, 10) : ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="patientId"
                  label="Patient ID"
                  value={formData.patientId}
                  InputProps={{ readOnly: true }}
                  required
                />
              </Grid>
              {error && (
                <Grid item xs={12}><Typography color="error">{error}</Typography></Grid>
              )}
              {success && (
                <Grid item xs={12}><Typography color="primary">{success}</Typography></Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                  {editingPatient ? 'Update Patient' : 'Register Patient'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                  Cancel
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