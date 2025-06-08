import express from 'express';
import { getPhysicianDashboardStats } from '../controllers/physicianDashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats (physician or admin)
router.get('/stats', authenticate, authorize(['physician', 'admin']), getPhysicianDashboardStats);

export default router; 