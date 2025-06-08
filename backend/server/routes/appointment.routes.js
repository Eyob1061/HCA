// @ts-nocheck
import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots,
  getPhysicianAppointments,
  getAllPhysicians
} from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Patient routes
router.get('/patient', getPatientAppointments);
router.post('/', authorize('patient'), (req, res, next) => {
  console.log('[Appointment Route] POST /api/appointments hit.');
  next();
}, createAppointment);
router.get('/available-slots', getAvailableTimeSlots);
// Get all physicians (for dropdown)
router.get('/physicians', authorize(['patient', 'physician', 'admin']), getAllPhysicians);
// Get physician's appointments
router.get('/physician', authorize(['physician']), getPhysicianAppointments);

// Admin and physician routes
router.get('/', authorize(['admin', 'physician']), getAllAppointments);
router.get('/:id', authorize(['admin', 'physician']), getAppointmentById);
router.put('/:id/status', authorize(['admin', 'physician']), updateAppointmentStatus);

// Patient and admin can cancel appointments
router.put('/:id/cancel', authorize(['admin', 'patient']), cancelAppointment);


export default router; 