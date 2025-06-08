import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  ListItemButton,
  Menu,
  Badge,
  Avatar,
  ListItemAvatar,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  MedicalServices as MedicalServicesIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './DashboardLayout.css';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const DashboardLayout = ({ children, menuItems, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  const fetchNotifications = async () => {
    if (!user || !user.token) {
      console.error('User not authenticated.');
      setNotificationError('Please login to view notifications.');
      return;
    }

    setLoadingNotifications(true);
    setNotificationError(null);
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }

      const data = await response.json();
      if (data.success) {
        const sortedNotifications = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedNotifications);
      } else {
        setNotificationError(data.error || 'Failed to fetch notifications.');
      }

    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationError(error.message || 'Failed to fetch notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();

    const currentPath = window.location.pathname;

    if (currentPath.includes('/dashboard/admin')) {
      window.location.href = '/login?user=admin';
    } 
    else if (currentPath.includes('/dashboard/doctor')) {
      window.location.href = '/login?user=physician';
    } 
    else if (currentPath.includes('/dashboard/patient')) {
      window.location.href = '/login?user=patient';
    } 
    else if (currentPath.includes('/dashboard/receptionist')) {
      window.location.href = '/login?user=receptionist';
    } 
    else {
      window.location.href = '/';
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'advice_request':
        return (
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              Patient ID: {notification.metadata?.patientId}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              Description: {notification.metadata?.description}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              Urgency: {notification.metadata?.urgency}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.time}
            </Typography>
          </React.Fragment>
        );
      case 'feedback':
        return (
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              Patient ID: {notification.metadata?.patientId}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              Doctor: {notification.metadata?.doctorName}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              Comment: {notification.metadata?.comments}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.time}
            </Typography>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block' }}
            >
              {notification.message || notification.title}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.time}
            </Typography>
          </React.Fragment>
        );
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'advice_request':
        return <MedicalServicesIcon />;
      case 'feedback':
        return <FeedbackIcon />;
      case 'system_alert':
        return <AssignmentIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      paddingTop: '80px'
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          color: 'text.primary',
          height: { xs: '64px', sm: '72px' }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1976d2' }}>
            CND Healthcare
          </Typography>
          
          <IconButton 
            sx={{ mr: 2, color: '#1976d2' }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={handleUserMenuClick}
            size="large"
            sx={{ color: '#1976d2' }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                backgroundColor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.name || 'Admin User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: 'error.main',
                py: 1,
                '&:hover': {
                  backgroundColor: 'error.light',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                overflow: 'auto',
                mt: 1.5,
                backgroundColor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: 'none',
                '& .MuiList-root': {
                  py: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {loadingNotifications ? (
                <ListItem>
                  <ListItemIcon><CircularProgress size={20} /></ListItemIcon>
                  <ListItemText primary="Loading notifications..." />
                </ListItem>
              ) : notificationError ? (
                <ListItem>
                  <ListItemText primary={`Error: ${notificationError}`} sx={{ color: 'error.main' }} />
                </ListItem>
              ) : notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              ) : (
                notifications.map((notification) => (
                  <React.Fragment key={notification._id || notification.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getNotificationIcon(notification)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        secondary={renderNotificationContent(notification)}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
            {notifications.length > 0 && !loadingNotifications && !notificationError && (
              <Box 
                sx={{ 
                  p: 1, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  component="button"
                  sx={{ 
                    color: 'primary.main',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={handleNotificationClose}
                >
                  View All Notifications
                </Typography>
              </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: 'none',
            marginTop: '64px'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#1976d2',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              item.label !== 'Logout' && (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={item.onClick}
                    selected={location.pathname === item.path}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                      },
                      '&.active': {
                        backgroundColor: '#bbdefb',
                        borderLeft: '4px solid #1976d2',
                        '& .MuiListItemIcon-root': {
                          color: '#1976d2',
                        },
                        '& .MuiListItemText-root': {
                          '& .MuiTypography-root': {
                            fontWeight: 'bold',
                            color: '#1976d2',
                          },
                        },
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path ? '#1976d2' : '#757575',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: 'calc(100vh - 80px)',
          backgroundColor: 'transparent',
          '& .dashboard-title': {
            mb: 3,
            pt: 2
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default DashboardLayout;