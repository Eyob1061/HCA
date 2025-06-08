// Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
} from '@mui/material';

// Import MUI icons
import {
  LockOutlined,
  Person,
  MedicalServices,
  AdminPanelSettings,
  CalendarToday
} from '@mui/icons-material';

// Import custom CSS
import './Login.css';
import { validateCredentials } from '../Auth/passwords';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get('user');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: userType || 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(userType || 'patient');

  // User type specific configurations
  const userTypeConfig = {
    patient: {
      title: 'Patient Portal Login',
      subtitle: 'Access your healthcare records and appointments',
      icon: <Person fontSize="large" />,
      color: '#4CAF50',
      chipColor: 'success'
    },
    admin: {
      title: 'Administrator Login',
      subtitle: 'Access system administration',
      icon: <AdminPanelSettings fontSize="large" />,
      color: '#F44336',
      chipColor: 'error'
    },
    physician: {
      title: 'Physician Portal Login',
      subtitle: 'Access patient records and schedules',
      icon: <MedicalServices fontSize="large" />,
      color: '#2196F3',
      chipColor: 'primary'
    }
  };

  const currentUserType = userTypeConfig[selectedUserType] || userTypeConfig.patient;

  useEffect(() => {
    // Set the initial user type based on URL parameter
    if (userType) {
      setSelectedUserType(userType);
    } else {
      // Only redirect to home if coming directly to /login without any user type
      // and not from a logout action
      const fromLogout = location.state?.fromLogout;
      if (!fromLogout) {
        navigate('/', { replace: true });
      }
    }
  }, [userType, navigate, location]);

  // Redirect to home if trying to access login directly without userType
  useEffect(() => {
    if (!searchParams.get('user')) {
      navigate('/', { replace: true });
    }
  }, [navigate, searchParams]);

  // Define dashboard routes for each user type
  const dashboardRoutes = {
    admin: '/dashboard/admin',
    patient: '/dashboard/patient',
    physician: '/dashboard/physician'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password, userType } = formData;
      console.log('Attempting login with:', { email, password, userType });
      
      const userData = await login(email, password, userType);
      console.log('Login successful:', userData);
      
      // Redirect to the appropriate dashboard based on user role
      const dashboardPath = `/dashboard/${userData.role.toLowerCase()}`;
      window.location.href = dashboardPath;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {currentUserType.icon}
          <Typography variant="h5" component="h1" sx={{ mt: 2, color: currentUserType.color }}>
            {currentUserType.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            {currentUserType.subtitle}
          </Typography>
          <Chip 
            label={selectedUserType.toUpperCase()} 
            color={currentUserType.chipColor} 
            sx={{ mb: 2 }} 
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: currentUserType.color }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {showForgotMessage && (
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            onClose={() => setShowForgotMessage(false)}
          >
            Please contact the system administrator to reset your password.
            <br />
            Email: admin@cnd.com
            <br />
            Phone: (123) 456-7890
          </Alert>
        )}

        {selectedUserType === 'patient' && (
          <Box textAlign="center" mt={3}>
            <Button
              color="primary"
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              ← Back to Home
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;