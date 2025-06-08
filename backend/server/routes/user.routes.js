// @ts-nocheck

import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetPassword,
  getUserStats,
  getAllPatients
} from '../controllers/user.controller.js';

const router = express.Router();

// Protect all routes with authentication and admin authorization
router.use(authenticate);

// Get all patients (admin or physician)
router.get('/patients', authorize(['admin', 'physician']), getAllPatients);

// Get user statistics for admin dashboard (admin only)
router.get('/stats', authorize(['admin', 'physician']), getUserStats);

// Get all users (admin only)
router.get('/', authorize(['admin', 'physician']), getAllUsers);

// Create new user (admin or physician)
router.post('/', authorize(['admin', 'physician']), createUser);

//reset password (admin only)
router.put('/reset-password', authorize(['admin', 'physician']), resetPassword);

// Get user by ID (admin only)
router.get('/:id', authorize(['admin', 'physician']), getUserById);

// Update user (admin only)
router.put('/:id', authorize(['admin', 'physician']), updateUser);

// Delete user (admin only)
router.delete('/:id', authorize(['admin', 'physician']), deleteUser);

// Toggle user status (admin only)
router.patch('/:id/status', authorize(['admin', 'physician']), toggleUserStatus);

export default router;