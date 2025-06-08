import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, Typography, Grid, TextField, Button, MenuItem, Container, ListItemIcon, ListItemText,
  Alert, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { AccountCircle, Settings, ExitToApp, VpnKey, Person, Dashboard, People, CalendarToday, Assessment, CheckCircle } from "@mui/icons-material";
import DashboardLayout from "../../DasboardLayout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Auth/AuthContext';

const UserManagement = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  // Account activation states
  const [activationData, setActivationData] = useState({
    email: "",
    accountStatus: "active"
  });
  const [accountError, setAccountError] = useState("");
  const [activationSuccess, setActivationSuccess] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?user=admin');
    }
  }, [user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle account creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    try {
      // Validation
      if (!userData.fullName || !userData.username || !userData.email || !userData.password || !userData.role) {
        setFormError("All fields are required!");
        return;
      }

      if (userData.password.length < 6) {
        setFormError("Password must be at least 6 characters long!");
        return;
      }

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setSuccessMessage("User created successfully!");
      setShowSnackbar(true);
      
      // Reset form
      setUserData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  // Handle activation data changes
  const handleActivationChange = (e) => {
    setActivationData({
      ...activationData,
      [e.target.name]: e.target.value
    });
    
    if (activationSuccess) {
      setActivationSuccess(false);
    }
  };

  // Handle account activation/deactivation
  const handleAccountAction = async (e) => {
    e.preventDefault();
    setAccountError("");
    setActivationSuccess(false);

    try {
      if (!activationData.email) {
        setAccountError("Please enter a valid email address.");
        return;
      }

      // 1. Fetch all users (or use your existing users state)
      let userList = users;
      if (!userList.length) {
        // If users are not loaded, fetch them
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        userList = data.data || [];
      }

      // 2. Find the user by email
      const userToUpdate = userList.find(u => u.email === activationData.email);
      if (!userToUpdate) {
        setAccountError("User not found with that email.");
        return;
      }

      // 3. Update account status by ID
      const response = await fetch(`http://localhost:5000/api/users/${userToUpdate.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: activationData.accountStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update account status');
      }

      setActivationSuccess(true);
      setSuccessMessage(`Account successfully ${activationData.accountStatus === "active" ? "activated" : "deactivated"}!`);
      setShowSnackbar(true);

      // Reset form after successful submission
      setActivationData({
        email: "",
        accountStatus: "active"
      });
    } catch (error) {
      setAccountError(error.message);
    }
  };

  // Consistent menuItems structure
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/admin',
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/admin')
    },
    { 
      label: 'User Management', 
      path: '/dashboard/admin/user-management', 
      icon: <People />,
      onClick: () => navigate('/dashboard/admin/user-management')
    },
    { 
      label: 'Settings', 
      path: '/dashboard/admin/settings', 
      icon: <Settings />,
      onClick: () => navigate('/dashboard/admin/settings')
    },
    { 
      label: 'Logout', 
      path: '/login?user=admin', 
      icon: <ExitToApp />,
      onClick: () => {
        logout();
        navigate('/login?user=admin');
      },
      style: {
        icon: { color: '#d32f2f' },
        text: {
          '& .MuiTypography-root': {
            color: '#d32f2f',
            fontSize: '0.9rem',
          },
        }
      }
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Container>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        <Grid container spacing={4}>
          {/* Create User Account Card */}
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h5" sx={cardTitleStyle}>Create User Account</Typography>
                {formError && <Typography sx={errorStyle}>{formError}</Typography>}
                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                  <TextField 
                    label="Full Name" 
                    name="fullName" 
                    value={userData.fullName} 
                    onChange={handleChange} 
                    fullWidth 
                    sx={inputStyle} 
                  />
                  <TextField 
                    label="Username" 
                    name="username" 
                    value={userData.username} 
                    onChange={handleChange} 
                    fullWidth 
                    sx={inputStyle} 
                  />
                  <TextField 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={userData.email} 
                    onChange={handleChange} 
                    fullWidth 
                    sx={inputStyle} 
                  />
                  <TextField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    value={userData.password} 
                    onChange={handleChange} 
                    fullWidth 
                    sx={inputStyle} 
                  />
                  <TextField
                    select
                    label="Role"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="physician">Physician</MenuItem>
                  </TextField>
                  <Button type="submit" sx={buttonStyle}>Create Account</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <VpnKey sx={iconTopStyle} />  
                <Typography variant="h5" sx={cardTitleStyle}>Account Activation Management</Typography>
                {accountError && <Typography sx={errorStyle}>{accountError}</Typography>}
                {activationSuccess && (
                  <Typography sx={successStyle}>
                    Account successfully {activationData.accountStatus === "active" ? "activated" : "deactivated"}!
                  </Typography>
                )}
                <form onSubmit={handleAccountAction} style={{ marginTop: "10px" }}>
                  <TextField 
                    label="User Email Address" 
                    name="email"
                    type="email"
                    value={activationData.email} 
                    onChange={handleActivationChange} 
                    fullWidth 
                    placeholder="Enter user's email address"
                    sx={inputStyle}
                    required
                  />
                  <TextField
                    select
                    label="Account Status"
                    name="accountStatus"
                    value={activationData.accountStatus}
                    onChange={handleActivationChange}
                    fullWidth
                    sx={inputStyle}
                  >
                    <MenuItem value="active">Activate Account</MenuItem>
                    <MenuItem value="inactive">Deactivate Account</MenuItem>
                    <MenuItem value="suspended">Suspend Account</MenuItem>
                  </TextField>
                  <Button 
                    type="submit" 
                    sx={buttonStyle}
                    startIcon={activationData.accountStatus === "active" ? <CheckCircle /> : <VpnKey />}
                  >
                    {activationData.accountStatus === "active" ? "Activate Account" : 
                     activationData.accountStatus === "inactive" ? "Deactivate Account" : "Suspend Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

const headerStyle = {
  fontWeight: "bold",
  color: "#1E3A8A",
  mb: 3,
  textAlign: "center",
};

const cardStyle = {
  background: "linear-gradient(135deg, #ffffff, #f0f2f5)",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  padding: "24px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
};

const cardTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1E3A8A",
  textAlign: "center",
  marginBottom: "15px",
};

const inputStyle = {
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
};

const buttonStyle = {
  marginTop: "10px",
  width: "100%",
  background: "linear-gradient(45deg, #3498db, #2c3e50) !important",
  color: "#fff",
  fontWeight: "bold",
  padding: "10px",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #2980b9, #1c2833) !important",
  },
};

const iconTopStyle = {
  fontSize: "50px",
  display: "block",
  margin: "0 auto 10px auto",
  color: "#3498db",
};

const errorStyle = {
  color: "red",
  fontSize: "0.9rem",
  textAlign: "center",
  marginBottom: "10px",
};

const successStyle = {
  color: "#4caf50",
  backgroundColor: "rgba(76, 175, 80, 0.1)",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
  marginBottom: "15px",
  fontWeight: "500"
};

export default UserManagement;
