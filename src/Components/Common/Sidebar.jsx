import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  ListItemButton,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = ({ items, title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Icon mapping
  const getIcon = (text) => {
    switch (text.toLowerCase()) {
      case 'create account':
        return <PersonAddIcon />;
      case 'activate account':
        return <CheckCircleIcon />;
      case 'user management':
        return <PeopleIcon />;
      case 'settings':
        return <SettingsIcon />;
      default:
        return <PersonAddIcon />;
    }
  };

  const handleLogout = () => {
    logout();
    // Use direct URL navigation instead of React Router's navigate
    window.location.href = '/';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2, mt: 8 }}>
          <Typography variant="h6" component="div" sx={{ color: '#1976d2' }}>
            {title}
          </Typography>
        </Box>
        <Divider />
        <List>
          {items.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  console.log('Navigating to:', item.path);
                  window.location.href = item.path;
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>
                  {getIcon(item.text)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.9rem',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: '#ffebee',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#d32f2f' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                sx={{
                  '& .MuiTypography-root': {
                    color: '#d32f2f',
                    fontSize: '0.9rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;