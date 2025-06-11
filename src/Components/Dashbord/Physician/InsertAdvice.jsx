import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Dashboard,
  Description,
  MedicalServices,
  CheckCircle,
  People,
  EventNote,
  Edit,
  Send
} from '@mui/icons-material';
import DashboardLayout from '../DasboardLayout';

const InsertAdvice = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    condition: '',
    advice: '',
    medications: '',
    lifestyle: '',
    urgency: 'normal'
  });
  
  // State for patient search
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        
        const response = await fetch('http://localhost:5000/api/users/patients', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const data = await response.json();
        setPatients(data.data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        alert('Failed to load patients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard/physician', 
      icon: <Dashboard />,
      onClick: () => navigate('/dashboard/physician')
    },
    { 
      label: 'Generate Report', 
      path: '/dashboard/physician/generate-report', 
      icon: <Description />,
      onClick: () => navigate('/dashboard/physician/generate-report')
    },
    { 
      label: 'Insert Advice', 
      path: '/dashboard/physician/insert-advice', 
      icon: <MedicalServices />,
      onClick: () => navigate('/dashboard/physician/insert-advice')
    },
    { 
      label: 'Approve Recommendations', 
      path: '/dashboard/physician/approve-recommendations', 
      icon: <CheckCircle />,
      onClick: () => navigate('/dashboard/physician/approve-recommendations')
    },
    { 
      label: 'View Patients', 
      path: '/dashboard/physician/view-patients', 
      icon: <People />,
      onClick: () => navigate('/dashboard/physician/view-patients')
    },
    { 
      label: 'View Appointments', 
      path: '/dashboard/physician/view-appointments', 
      icon: <EventNote />,
      onClick: () => navigate('/dashboard/physician/view-appointments')
    },
    { 
      label: 'Update Patient Data', 
      path: '/dashboard/physician/update-patient', 
      icon: <Edit />,
      onClick: () => navigate('/dashboard/physician/update-patient')
    }
  ];

  // Handle patient search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filtered = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
        (patient.patientId && patient.patientId.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPatients(filtered);
      setShowPatientList(true);
    } else {
      setFilteredPatients([]);
      setShowPatientList(false);
    }
  };

  // Handle patient selection from search results
  const handlePatientSelect = (patient) => {
    // Use either patient._id or patient.id, whichever is available
    const patientId = patient._id || patient.id;
    
    if (!patient || !patientId) {
      console.error('Invalid patient data:', patient);
      return;
    }
    
    console.log('Patient selected:', {
      patientId: patientId,
      patientName: patient.fullName,
      patientData: patient
    });
    
    // Create the updated form data first
    const updatedFormData = {
      ...formData,
      patientId: patientId,
      patientName: patient.fullName
    };
    
    console.log('Updating formData with patient:', updatedFormData);
    
    // Update all states in a single batch
    setFormData(updatedFormData);
    setSearchQuery(patient.fullName);
    setShowPatientList(false);
    
    // Clear any previous errors
    setFormErrors(prev => ({
      ...prev,
      patientId: undefined
    }));
    
    // Log the current state after updates
    console.log('State after patient selection:', {
      formData: updatedFormData,
      searchQuery: patient.fullName,
      showPatientList: false
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validation is now handled directly in handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted. Current formData:', formData);
    console.log('Search query:', searchQuery);
    console.log('Filtered patients:', filteredPatients);
    
    // First, handle auto-selection if needed
    if (searchQuery && !formData.patientId && filteredPatients.length === 1) {
      console.log('Attempting auto-selection...');
      // Update the form state first
      const selectedPatient = filteredPatients[0];
      const updatedFormData = {
        ...formData,
        patientId: selectedPatient._id || selectedPatient.id,
        patientName: selectedPatient.fullName
      };
      
      // Update the form data state
      setFormData(updatedFormData);
      setSearchQuery(selectedPatient.fullName);
      setShowPatientList(false);
      
      // Clear any previous patient errors
      setFormErrors(prev => ({
        ...prev,
        patientId: undefined
      }));
      
      // Use the updated form data for validation
      validateAndSubmit(updatedFormData);
      return;
    }
    
    // If no auto-selection was needed, proceed with current form data
    validateAndSubmit(formData);
  };
  
  const validateAndSubmit = async (dataToValidate) => {
    console.log('Validating form data:', JSON.parse(JSON.stringify(dataToValidate)));
    
    // Create a deep copy of the data to validate
    const validationData = { ...dataToValidate };
    
    // Validate the form data
    const errors = {};
    
    // Check for patient selection
    if (!validationData.patientId) {
      console.error('Validation failed: No patient ID found');
      console.log('Current patient data:', {
        patientId: validationData.patientId,
        patientName: validationData.patientName
      });
      errors.patientId = 'Please select a patient from the list';
    } else if (!validationData.patientName) {
      console.error('Validation failed: Patient name missing');
      errors.patientId = 'Patient name is missing';
    } else {
      console.log('Patient selected successfully:', {
        id: validationData.patientId,
        name: validationData.patientName
      });
    }
    
    // Validate other required fields
    if (!validationData.condition) {
      errors.condition = 'Medical condition is required';
    }
    if (!validationData.advice) {
      errors.advice = 'Medical advice is required';
    }
    if (!validationData.medications) {
      errors.medications = 'Medications information is required';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return; // Stop submission if there are errors
    }
    
    try {
      console.log('Form Data:', dataToValidate);
      
      // Get the current user (physician)
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      // Prepare the advice data
      const payload = {
        patientId: dataToValidate.patientId,
        condition: dataToValidate.condition,
        advice: dataToValidate.advice,
        medications: dataToValidate.medications,
        lifestyle: dataToValidate.lifestyle || '',
        urgencyLevel: dataToValidate.urgency.charAt(0).toUpperCase() + dataToValidate.urgency.slice(1),
        status: 'approved', // Auto-approve physician advice
        physicianId: user.id, // Track which physician created this advice
        physicianName: user.fullName // Track physician's name
      };
      
      console.log('Submitting advice:', payload);
      
      // Submit the advice
      console.log('Sending POST request to /api/advice with payload:', payload);
      
      const response = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include' // Important for cookies/sessions
      });
      
      console.log('Response status:', response.status);
      const responseData = await response.json().catch(e => ({}));
      console.log('Response data:', responseData);
      
      if (!response.ok) {
        const errorMsg = responseData.message || 'Failed to submit advice';
        console.error('Error response:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Show success message
      alert('Advice submitted successfully and is now visible to the patient!');
      
      // Reset the form
      setFormData({
        patientId: '',
        patientName: '',
        condition: '',
        advice: '',
        medications: '',
        lifestyle: '',
        urgency: 'normal'
      });
      setSearchQuery('');
      
    } catch (error) {
      console.error('Error submitting advice:', error);
      alert(`Failed to submit advice: ${error.message}`);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} title="Physician Portal">
      {/* Debug Panel - Can be removed in production */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        zIndex: 1000,
        maxWidth: '300px',
        fontSize: '12px'
      }}>
        <div><strong>Current Form Data:</strong></div>
        <pre style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Search Patient"
                    value={formData.patientId ? formData.patientName : searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowPatientList(true)}
                    error={!!formErrors.patientId}
                    helperText={formErrors.patientId || 'Type to search for a patient'}
                    disabled={loading}
                    InputProps={{
                      'aria-required': 'true',
                      'aria-invalid': !!formErrors.patientId,
                    }}
                  />
                  {showPatientList && filteredPatients.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      marginTop: '4px'
                    }}>
                      {filteredPatients.map((patient) => (
                        <div
                          key={`patient-${patient._id}`}
                          onClick={() => handlePatientSelect(patient)}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          <div><strong>{patient.fullName}</strong></div>
                          <div style={{ fontSize: '0.8em', color: '#666' }}>
                            ID: {patient.patientId || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.patientId && (
                  <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                    <div>ID: <code>{formData.patientId}</code></div>
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, patientId: '', patientName: '' }));
                        setSearchQuery('');
                        setShowPatientList(false);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Change Patient
                    </Button>
                  </div>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  error={!!formErrors.condition}
                  helperText={formErrors.condition}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical Advice"
                  name="advice"
                  value={formData.advice}
                  onChange={handleChange}
                  error={!!formErrors.advice}
                  helperText={formErrors.advice}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  error={!!formErrors.medications}
                  helperText={formErrors.medications}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lifestyle Recommendations"
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<Send />}
                >
                  Submit Advice
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default InsertAdvice; 