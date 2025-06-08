import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getAdminStats } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Protect all routes with authentication and admin authorization
router.use(authenticate, authorize(['admin']));

// GET /api/dashboard/admin-stats
router.get('/admin-stats', getAdminStats);

export default router;