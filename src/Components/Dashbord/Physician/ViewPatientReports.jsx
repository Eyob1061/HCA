import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Search, Refresh, Visibility } from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const ViewPatientReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      const response = await fetch('http://localhost:5000/api/patient-reports', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewReport = (reportId) => {
    navigate(`/dashboard/physician/patient-reports/${reportId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = reports.filter(report => 
    report.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <DashboardLayout 
      menuItems={[]} 
      title="Patient Reports"
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Patient Reports
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={fetchReports}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box p={2} color="error.main">
              {error}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Diagnosis</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedReports.length > 0 ? (
                      paginatedReports.map((report) => (
                        <TableRow key={report._id} hover>
                          <TableCell>{report.patientName || 'N/A'}</TableCell>
                          <TableCell>{report.patientId || 'N/A'}</TableCell>
                          <TableCell>
                            {report.diagnosis || 'No diagnosis provided'}
                          </TableCell>
                          <TableCell>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Report">
                              <IconButton 
                                onClick={() => handleViewReport(report._id)}
                                color="primary"
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredReports.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default ViewPatientReports;
