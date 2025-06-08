// @ts-nocheck
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js'; // Use named imports
import { register, login, getCurrentUser, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// Test route to verify API is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth API is working',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public for initial registration, Admin/Physician for patient registration
 */
router.post('/register', async (req, res, next) => {
  // If registering a patient, require authentication
  if (req.body.role === 'patient') {
    return authenticate(req, res, () => {
      authorize(['admin', 'physician'])(req, res, () => {
        register(req, res);
      });
    });
  }
  // For other roles (like initial admin registration), allow without auth
  register(req, res);
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
router.post('/login', login);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 */
router.get('/me', authenticate, authorize(['user', 'admin', 'registration']), getCurrentUser);

// Logout route
router.post('/logout', logout);

// Verify token route
router.get('/verify', authenticate, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});

export default router;