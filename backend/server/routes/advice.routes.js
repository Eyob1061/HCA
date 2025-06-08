// @ts-nocheck
import express from 'express';
import {
  createAdvice,
  getAllAdvice,
  getPatientAdvice,
  getAdviceById,
  updateAdvice,
  deleteAdvice,
  getAdviceByUrgency,
  approveAdvice,
  rejectAdvice
} from '../controllers/advice.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Create a new advice request (patients only)
router.post('/', createAdvice);

// Get all advice requests (admin/physician only)
router.get('/', getAllAdvice);

// Get advice requests for the logged-in patient
router.get('/patient', getPatientAdvice);

// Get advice requests by urgency level (admin/physician only)
router.get('/urgency/:urgencyLevel', getAdviceByUrgency);

// Get a single advice request by ID
router.get('/:id', getAdviceById);

// Update an advice request
router.put('/:id', updateAdvice);

// Delete an advice request
router.delete('/:id', deleteAdvice);

// Approve an advice
router.put('/:id/approve', approveAdvice);

// Reject an advice
router.put('/:id/reject', rejectAdvice);

export default router; 