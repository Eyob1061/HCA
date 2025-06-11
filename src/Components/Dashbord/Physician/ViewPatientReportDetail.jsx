import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { ArrowBack, Print, PictureAsPdf } from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const ViewPatientReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        
        const response = await fetch(`http://localhost:5000/api/patient-reports/${reportId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const data = await response.json();
        if (data.success) {
          setReport(data.data);
        } else {
          throw new Error(data.message || 'Failed to load report');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // This is a placeholder for PDF download functionality
    // You would typically generate a PDF here using a library like jsPDF or html2pdf
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} color="error.main">
        <Typography variant="h6">Error loading report</Typography>
        <Typography>{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box p={3}>
        <Typography variant="h6">Report not found</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Box>
    );
  }

  return (
    <DashboardLayout menuItems={[]} title="Patient Report">
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back to Reports
          </Button>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ mr: 2 }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              onClick={handleDownloadPdf}
            >
              Download PDF
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Medical Report
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Report ID: {report._id}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                Patient Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Patient Name" 
                    secondary={report.patientName || 'N/A'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Patient ID" 
                    secondary={report.patientId || 'N/A'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={report.dateOfBirth ? new Date(report.dateOfBirth).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Gender" 
                    secondary={report.gender || 'N/A'} 
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                Report Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Report Date" 
                    secondary={new Date(report.createdAt).toLocaleDateString()} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Physician" 
                    secondary={report.physicianName || 'N/A'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Department" 
                    secondary={report.department || 'N/A'} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              Clinical Information
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Diagnosis
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 80, bgcolor: '#fafafa' }}>
                {report.diagnosis || 'No diagnosis provided'}
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Treatment Plan
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 100, bgcolor: '#fafafa' }}>
                {report.treatmentPlan || 'No treatment plan provided'}
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Notes
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 80, bgcolor: '#fafafa' }}>
                {report.notes || 'No additional notes'}
              </Paper>
            </Box>
          </Box>

          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" color="textSecondary" align="right">
              Generated on {new Date(report.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default ViewPatientReportDetail;
