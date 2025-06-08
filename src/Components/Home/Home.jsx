import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// MUI Components
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

// MUI Icons
import {
  AdminPanelSettings,
  PersonOutline,
  LocalHospital,
  RecordVoiceOver,
  KeyboardArrowDown,
  MedicalServices,
  HealthAndSafety,
  Medication,
  CalendarMonth,
  LocationOn,
  Phone,
  Email,
  ArrowForward,
  People,
  AccessTime,
  GroupsRounded,
  CalendarToday,
  PersonAdd,
} from '@mui/icons-material';

// Custom CSS
import './Home.css';

// Styled Components
import styled from '@emotion/styled';

// Create a custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080',
      light: '#00a3a3',
      dark: '#004d4d',
    },
    secondary: {
      main: '#2c3e50',
      light: '#3c5268',
      dark: '#1a252f',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      background: 'linear-gradient(45deg, #008080, #004d4d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1.5rem',
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 128, 128, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #008080, #004d4d)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(45deg, #004d4d, #008080)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(0, 128, 128, 0.2)',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          animation: 'fadeInDown 0.3s ease',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 128, 128, 0.08)',
            transform: 'translateX(5px)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1400px !important',
          '@media (min-width: 1200px)': {
            paddingLeft: '40px',
            paddingRight: '40px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          marginLeft: '0',
          marginRight: '0',
        },
      },
    },
  },
});

// Dropdown Login Menu
const LoginMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = (userType) => {
    handleClose();
    navigate(`/login?user=${userType}`);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        Login
      </Button>
      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleLogin('admin')}>
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          <ListItemText>Admin Login</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleLogin('physician')}>
          <ListItemIcon>
            <MedicalServices />
          </ListItemIcon>
          <ListItemText>Physician Login</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleLogin('patient')}>
          <ListItemIcon>
            <PersonOutline />
          </ListItemIcon>
          <ListItemText>Patient Login</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Styled Components
const StyledHeroSection = styled('section')({
  minHeight: '100vh',
  background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('https://source.unsplash.com/random/1920x1080/?healthcare') center/cover`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
});

const StyledServiceCard = styled(Card)({
  height: '100%',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
});

const StyledContactForm = styled('form')({
  background: 'white',
  padding: '2rem',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
});

const StyledSection = styled('section')({
  padding: '120px 0',
  position: 'relative',
});

const AboutSection = styled('section')({
  paddingTop: '80px',
  padding: '120px 40px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at 20% 20%, rgba(0, 128, 128, 0.03) 0%, transparent 25%),
                radial-gradient(circle at 80% 80%, rgba(0, 128, 128, 0.03) 0%, transparent 25%)`,
    zIndex: 0,
  },
});

// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  
  // Section refs for navigation
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (elementRef) => {
    const offset = 100; // Adjust this value based on your navbar height
    const elementPosition = elementRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const sectionStyle = {
    scrollMarginTop: '100px', // This should match the offset above
  };

  const features = [
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      title: 'Easy Appointment Booking',
      description: 'Schedule your medical appointments online with just a few clicks.'
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      title: 'Access Medical Records',
      description: 'View your medical history and test results securely.'
    },
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: '24/7 Access',
      description: 'Access your healthcare information anytime, anywhere.'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="home-container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <h1>CND Health</h1>
          </div>
          <div className="nav-links">
            <Button 
              className="nav-link"
              onClick={() => scrollToSection(servicesRef)}
            >
              Services
            </Button>
            <Button 
              className="nav-link"
              onClick={() => scrollToSection(aboutRef)}
            >
              About Us
            </Button>
            <Button 
              className="nav-link"
              onClick={() => scrollToSection(contactRef)}
            >
              Contact
            </Button>
            <LoginMenu />
          </div>
        </nav>

        {/* Hero Section */}
        <Box className="hero-section">
          <Container maxWidth="lg">
            <Typography variant="h2" className="hero-title">
              Welcome to CND Healthcare
            </Typography>
            <Typography variant="h5" className="hero-subtitle" gutterBottom>
              Your Health, Our Priority
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              className="login-button"
              onClick={() => navigate('/login?user=patient')}
              sx={{ 
                mt: 4,
                px: 4,
                py: 1.5,
                fontSize: '1.2rem',
                backgroundColor: '#fff',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              Patient Login
            </Button>
          </Container>
        </Box>

        {/* Services Section with Enhanced Header */}
        <StyledSection ref={servicesRef} style={sectionStyle}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={6}>
              <Typography variant="h2" gutterBottom>
                Our Services
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Comprehensive Healthcare Solutions for Your Well-being
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {[
                {
                  icon: <MedicalServices fontSize="large" color="primary" />,
                  title: 'Medical Consultations',
                  description: 'Expert medical advice from experienced healthcare professionals.',
                },
                {
                  icon: <CalendarMonth fontSize="large" color="primary" />,
                  title: 'Online Appointments',
                  description: 'Easy and convenient appointment scheduling system.',
                },
                {
                  icon: <HealthAndSafety fontSize="large" color="primary" />,
                  title: 'Health Monitoring',
                  description: 'Regular health check-ups and continuous monitoring.',
                },
                {
                  icon: <Medication fontSize="large" color="primary" />,
                  title: 'Prescription Management',
                  description: 'Digital prescription services and medication tracking.',
                },
              ].map((service, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StyledServiceCard>
                    {service.icon}
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {service.description}
                    </Typography>
                  </StyledServiceCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </StyledSection>

        {/* Getting Started Section */}
        <Box className="getting-started-section">
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" align="center" gutterBottom className="section-title">
              Getting Started is Easy
            </Typography>
            <Grid container spacing={4} sx={{ mt: 3 }}>
              <Grid item xs={12} md={4}>
                <Box className="step-item">
                  <PersonAdd sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>
                    1. Create Account
                  </Typography>
                  <Typography>
                    Sign up with your email and basic information
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="step-item">
                  <MedicalServices sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>
                    2. Complete Profile
                  </Typography>
                  <Typography>
                    Add your medical history and preferences
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="step-item">
                  <CalendarToday sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>
                    3. Book Appointments
                  </Typography>
                  <Typography>
                    Start booking your medical appointments
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button 
                variant="contained"
                size="large"
                onClick={() => navigate('/login?user=patient')}
                className="get-started-button"
              >
                Get Started Now
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Enhanced About Section */}
        <AboutSection ref={aboutRef} style={sectionStyle}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={6}>
              <Typography variant="h2" gutterBottom>
                ABOUT US
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" paragraph>
                Leading Healthcare Provider with a Vision for Better Healthcare
              </Typography>
            </Box>
            
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom color="primary">
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  At CND Healthcare, we are committed to providing exceptional medical care through 
                  innovative digital solutions. Our mission is to make quality healthcare accessible, 
                  efficient, and patient-centered.
                </Typography>
                
                <Typography variant="h5" gutterBottom color="primary" sx={{ mt: 4 }}>
                  Our Vision
                </Typography>
                <Typography variant="body1" paragraph>
                  We envision a future where healthcare is seamlessly integrated with technology, 
                  making it more accessible and efficient for everyone. Our goal is to revolutionize 
                  the healthcare experience through digital innovation.
                </Typography>

                <Typography variant="h5" gutterBottom color="primary" sx={{ mt: 4 }}>
                  Our Values
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {[
                    'Patient-Centered Care',
                    'Innovation',
                    'Excellence',
                    'Integrity',
                    'Compassion',
                    'Collaboration'
                  ].map((value, index) => (
                    <Grid item xs={6} key={index}>
                      <Box display="flex" alignItems="center">
                        <ArrowForward color="primary" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={4}>
                  {[
                    {
                      icon: <People fontSize="large" color="primary" />,
                      number: '10k+',
                      label: 'Patients Served',
                    },
                    {
                      icon: <LocalHospital fontSize="large" color="primary" />,
                      number: '50+',
                      label: 'Expert Doctors',
                    },
                    {
                      icon: <AccessTime fontSize="large" color="primary" />,
                      number: '24/7',
                      label: 'Support Available',
                    },
                    {
                      icon: <GroupsRounded fontSize="large" color="primary" />,
                      number: '15+',
                      label: 'Years Experience',
                    },
                  ].map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center"
                        sx={{
                          p: 3,
                          backgroundColor: 'background.paper',
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      >
                        {stat.icon}
                        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </AboutSection>

        {/* Contact Section */}
        <StyledSection ref={contactRef} style={sectionStyle}>
          <Container maxWidth="lg">
            <Typography variant="h2" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Have questions? We would love to hear from you.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Contact Details
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn fontSize="large" color="primary" />
                    <Typography variant="body1" ml={2}>
                      123 Healthcare Avenue, Medical City
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Phone fontSize="large" color="primary" />
                    <Typography variant="body1" ml={2}>
                      +1 (234) 567-8900
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Email fontSize="large" color="primary" />
                    <Typography variant="body1" ml={2}>
                      contact@cndhealth.com
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledContactForm onSubmit={(e) => e.preventDefault()}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Your Name"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Your Email"
                    type="email"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Subject"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="submit-btn"
                  >
                    Send Message
                  </Button>
                </StyledContactForm>
              </Grid>
            </Grid>
          </Container>
        </StyledSection>

        {/* Footer Section */}
        <footer className="footer">
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  CND Health
                </Typography>
                <Typography variant="body1" paragraph>
                  Providing quality healthcare solutions for a better tomorrow.
                </Typography>
                </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>
                    <Button 
                      className="footer-link"
                      onClick={() => scrollToSection(servicesRef)}
                    >
                      Services
                    </Button>
                  </li>
                  <li>
                    <Button 
                      className="footer-link"
                      onClick={() => scrollToSection(aboutRef)}
                    >
                      About Us
                    </Button>
                  </li>
                  <li>
                    <Button 
                      className="footer-link"
                      onClick={() => scrollToSection(contactRef)}
                    >
                      Contact
                    </Button>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>
                    <Phone fontSize="small" color="primary" /> +1 234 567 8900
                  </li>
                  <li>
                    <Email fontSize="small" color="primary" /> info@cndhealth.com
                  </li>
                  <li>
                    <LocationOn fontSize="small" color="primary" /> 123 Addis Ababa, Ethiopia
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  Social
                </Typography>
                <Typography variant="body1" paragraph>
                  Subscribe to our Social.
                </Typography>
                <form>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Enter your email"
                    variant="outlined"
                  />
                  <Button variant="contained" color="primary" fullWidth>
                    Subscribe
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Container>
          <Box
            sx={{
              backgroundColor: '#00000',
              color: '#fff',
              py: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2">
              © 2024 CND Health. All rights reserved.
            </Typography>
            <Typography variant="caption" color="inherit">

              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>{' '}
              |{' '}
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
            </Typography>
          </Box>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Home;