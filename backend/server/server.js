import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes with correct paths
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adviceRoutes from './routes/advice.routes.js';
import patientReportRoutes from './routes/patientreport.routes.js';
import physicianDashboardRoutes from './routes/physicianDashboard.routes.js';
import notificationRoutes from './routes/notification.routes.js';
// import certificateRoutes from './routes/certificate.routes.js';
// import reportRoutes from './routes/report.routes.js';

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });

/** @type {express.Express} */
const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/patient-reports', patientReportRoutes);
app.use('/api/physician-dashboard', physicianDashboardRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/certificates', certificateRoutes);
// app.use('/api/reports', reportRoutes);

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Environment:', process.env.NODE_ENV);
console.log('Allowed CORS Origins:', allowedOrigins);

// Test route
/** @type {express.RequestHandler} */
const testHandler = (req, res) => {
  res.json({ 
    message: 'Land Registration API is running',
    time: new Date().toISOString()
  });
};

app.get('/api/test', testHandler);

/**
 * Connects to MongoDB and starts the server
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB Connected Successfully!');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Disconnected');
    });

    // Start server only after successful database connection
    app.listen(config.port, () => {
      console.log(`✅ Server is running on port ${config.port}`);
      console.log(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
    });

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err instanceof Error ? err.message : String(err));
    console.error('❌ Make sure MongoDB is running on your system');
    console.error('❌ Server will not start due to database connection failure');
    process.exit(1);
  }
};

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
/** @type {express.ErrorRequestHandler} */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

app.use(errorHandler);

// Start the server
connectDB().catch(console.error);