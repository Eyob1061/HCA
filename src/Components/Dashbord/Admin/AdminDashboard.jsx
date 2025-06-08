import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, Settings, People, VerifiedUser, Person, LocalHospital, PersonOutline, ExitToApp, Dashboard, CalendarToday, Assessment } from '@mui/icons-material';
import { Card, CardContent, Typography, Grid, ListItemIcon, ListItemText, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../DasboardLayout';
import '../Admin/AdminD.css';
import { useAuth } from '../../Auth/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.token) {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let didCancel = false;
    setLoading(true);
    setError('');

    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/admin-stats', {
          headers: { 'Authorization': `Bearer ${user.token}` },
          signal: controller.signal
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to fetch dashboard stats');
        }
        const data = await response.json();
        if (!didCancel) {
          setStats(data);
          setError('');
        }
      } catch (err) {
        if (!didCancel) {
          if (err.name === 'AbortError') {
            setError('Request timed out. Please try again.');
          } else {
            setError(err.message || 'Failed to fetch dashboard stats');
          }
        }
      } finally {
        if (!didCancel) setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    fetchStats();

    return () => {
      didCancel = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [user?.token]);

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/admin', 
      icon: <Dashboard />,
      onClick: () => {
        console.log('Navigating to admin dashboard');
        window.location.href = '/dashboard/admin';
      }
    },
    { 
      label: 'User Management', 
      path: '/dashboard/admin/user-management', 
      icon: <People />,
      onClick: () => {
        console.log('Navigating to user management');
        window.location.href = '/dashboard/admin/user-management';
      }
    },
    { 
      label: 'User List', 
      path: '/dashboard/admin/user-list', 
      icon: <PersonOutline />,
      onClick: () => {
        console.log('Navigating to user list');
        window.location.href = '/dashboard/admin/user-list';
      }
    },
    { 
      label: 'Settings', 
      path: '/dashboard/admin/settings', 
      icon: <Settings />,
      onClick: () => {
        console.log('Navigating to settings');
        window.location.href = '/dashboard/admin/settings';
      }
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Prepare pie chart data
  const pieData = stats ? [
    { name: 'Admins', value: stats.userTypeDistribution.admin },
    { name: 'Physicians', value: stats.userTypeDistribution.physician },
    { name: 'Patients', value: stats.userTypeDistribution.patient },
  ] : [];

  return (
    <DashboardLayout menuItems={menuItems} title="Admin Portal">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 300 }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : stats && (
        <Grid container spacing={4}>
          {[ 
            { title: 'Total Users', value: stats.totalUsers, icon: <People />, color: 'primary' },
            { title: 'Activated Accounts', value: stats.activatedAccounts, icon: <VerifiedUser />, color: 'secondary' },
            { title: 'Total Admins', value: stats.totalAdmins, icon: <Person />, color: 'primary' },
            { title: 'Total Physicians', value: stats.totalPhysicians, icon: <LocalHospital />, color: 'primary' },
            { title: 'Total Patients', value: stats.totalPatients, icon: <PersonOutline />, color: 'secondary' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="card">
                <CardContent className="card-content">
                  {React.cloneElement(item.icon, { fontSize: 'large', color: item.color })}
                  <div>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography variant="h4">{item.value}</Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h5" className="chart-title">
                  User Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <defs>
                      <linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0088FE" />
                        <stop offset="100%" stopColor="#0056b3" />
                      </linearGradient>
                      <linearGradient id="color2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00C49F" />
                        <stop offset="100%" stopColor="#007d65" />
                      </linearGradient>
                      <linearGradient id="color3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFBB28" />
                        <stop offset="100%" stopColor="#D19E00" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#color${index + 1})`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;