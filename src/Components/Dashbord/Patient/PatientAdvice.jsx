import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  CircularProgress, 
  Alert, 
  Button, 
  Box 
} from '@mui/material';
import { 
  MedicalServices, 
  Person, 
  LocalHospital, 
  Medication, 
  Event, 
  AccessTime, 
  Refresh 
} from '@mui/icons-material';
import { useAuth } from '../../Auth/AuthContext';

const PatientAdvice = () => {
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    const fetchPatientAdvice = async () => {
      if (!user?.token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/advice/patient', {
          headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch medical advice');
        }

        const result = await response.json();
        
        if (isMounted) {
          if (result.success && Array.isArray(result.data)) {
            // Sort by creation date, newest first
            const sortedAdvice = [...result.data].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            setAdviceList(sortedAdvice);
          } else {
            setAdviceList([]);
          }
        }
      } catch (err) {
        console.error('Error fetching advice:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load medical advice. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPatientAdvice();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRefresh = () => {
    setError('');
    setLoading(true);
    // The useEffect will be triggered when loading state changes
  };

  if (loading && adviceList.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary">
          Loading your medical advice...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefresh}
              startIcon={<Refresh />}
            >
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (adviceList.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Card variant="outlined">
          <CardContent>
            <MedicalServices sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Medical Advice Found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              You don't have any medical advice yet. Your physician will add advice after your appointments.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1">
          <MedicalServices sx={{ 
            verticalAlign: 'middle', 
            mr: 1.5, 
            fontSize: '2.125rem' 
          }} />
          My Medical Advice
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            minWidth: '120px'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>
      
      {adviceList.length > 0 ? (
        <Grid container spacing={3}>
          {adviceList.map((advice) => (
            <Grid item xs={12} key={advice._id}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocalHospital color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
                      <Typography variant="h6" color="primary">
                        {advice.condition}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {advice.advice}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                          <Medication color="action" sx={{ mr: 1, mt: 0.5, flexShrink: 0 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Medications</Typography>
                            <Typography variant="body2">{advice.medications || 'None prescribed'}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      {advice.lifestyle && (
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Event color="action" sx={{ mr: 1, mt: 0.5, flexShrink: 0 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Lifestyle</Typography>
                              <Typography variant="body2">{advice.lifestyle}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1,
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTime color="action" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(advice.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                        
                        {advice.physicianName && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person color="action" sx={{ mr: 1 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Physician
                              </Typography>
                              <Typography variant="body2">
                                {advice.physicianName}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Box 
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 4,
                            bgcolor: advice.status === 'approved' ? 'success.light' : 'warning.light',
                            color: advice.status === 'approved' ? 'success.dark' : 'warning.dark',
                            fontSize: '0.75rem',
                            fontWeight: 'medium',
                            textTransform: 'capitalize',
                            boxShadow: 1
                          }}
                        >
                          {advice.status}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          maxWidth: 600, 
          mx: 'auto',
          my: 6,
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <MedicalServices sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Medical Advice Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have any medical advice records yet. Your physician will add advice after your appointments.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ mt: 2 }}
          >
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PatientAdvice;
