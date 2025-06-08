import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Button, TextField, InputAdornment, IconButton, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert, Container, Box, CircularProgress, Pagination
} from '@mui/material';
import { 
  Dashboard, Settings, ExitToApp, People, Search, Edit, Delete, Check, Block, Save, Cancel,
  Visibility, VisibilityOff
} from '@mui/icons-material';
import DashboardLayout from '../../DasboardLayout';
import { useAuth } from '../../../Auth/AuthContext';
import debounce from 'lodash/debounce';

// API URL configuration
const API_BASE_URL = 'http://localhost:5000';

const UserList = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Edit user dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    accountStatus: ''
  });

  // State to toggle password visibility (if needed)
  const [showPassword, setShowPassword] = useState(false);

  // Debounced search function
  const debouncedFetchUsers = useCallback(
    debounce((search, page) => {
      fetchUsers(search, page);
    }, 300),
    []
  );

  // Fetch users from backend
  useEffect(() => {
    if (!user?.token) return;
    if (user.role !== 'admin') {
      setError('Access denied. Only admins can view all users.');
      setLoading(false);
      return;
    }
    debouncedFetchUsers(searchTerm, pagination.page);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, pagination.page, debouncedFetchUsers, user?.token, user?.role]);

  const fetchUsers = async (search = '', page = 1) => {
    if (!user?.token) {
      setError('No authentication token available');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Fetching users with token:', user.token);
      const response = await fetch(
        `${API_BASE_URL}/api/users?page=${page}&limit=${pagination.limit}&search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received users data:', data);
      
      setUsers(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        page
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Failed to fetch users: ${err.message}`);
      setUsers([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user status change
  const handleStatusChange = async (email, newStatus) => {
    if (!user?.token) {
      setError('No authentication token available');
      return;
    }

    try {
      const userToUpdate = users.find(u => u.email === email);
      if (!userToUpdate) {
        throw new Error('User not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/${userToUpdate.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          credentials: 'include',
          body: JSON.stringify({ accountStatus: newStatus })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(`Account status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.message);
    }
  };

  // Open edit dialog
  const handleEditClick = (userObj) => {
    setEditingUser(userObj);
    setEditFormData({
      fullName: userObj.fullName,
      email: userObj.email,
      role: userObj.role,
      accountStatus: userObj.accountStatus
    });
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  // Handle form field changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Save edited user
  const handleSaveEdit = async () => {
    if (!user?.token) {
      setError('No authentication token available');
      return;
    }

    if (editingUser) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/${editingUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            credentials: 'include',
            body: JSON.stringify(editFormData)
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuccess('User updated successfully!');
        fetchUsers();
        handleCloseEditDialog();
      } catch (err) {
        console.error('Error updating user:', err);
        setError(err.message);
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!user?.token) {
      setError('No authentication token available');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  // Consistent menuItems structure
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/admin',
      icon: <Dashboard />, onClick: () => navigate('/dashboard/admin')
    },
    { 
      label: 'User Management', 
      path: '/dashboard/admin/user-management', 
      icon: <People />, onClick: () => navigate('/dashboard/admin/user-management')
    },
    { 
      label: 'User List', 
      path: '/dashboard/admin/user-list', 
      icon: <People />, onClick: () => navigate('/dashboard/admin/user-list')
    },
    { 
      label: 'Settings', 
      path: '/dashboard/admin/settings', 
      icon: <Settings />, onClick: () => navigate('/dashboard/admin/settings')
    },
    { 
      label: 'Logout', 
      path: '/login?user=admin', 
      icon: <ExitToApp />, onClick: () => { logout(); navigate('/login?user=admin'); },
      style: {
        icon: { color: '#d32f2f' },
        text: {
          '& .MuiTypography-root': {
            color: '#d32f2f', fontSize: '0.9rem',
          },
        }
      }
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        
        {/* Search field */}
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success message */}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {/* Users table */}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.accountStatus}
                      color={user.accountStatus === 'active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Full Name"
              name="fullName"
              value={editFormData.fullName}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={editFormData.role}
                onChange={handleEditFormChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="physician">Physician</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="accountStatus"
                value={editFormData.accountStatus}
                onChange={handleEditFormChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default UserList;
