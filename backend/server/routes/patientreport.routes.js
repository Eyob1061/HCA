import express from 'express';
import { 
  createPatientReport, 
  getAllPatientReports,
  getPatientReportById 
} from '../controllers/patientreport.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create a new patient report (physician or admin)
router.post(
  '/',
  authenticate,
  authorize(['physician', 'admin']),
  (req, res, next) => {
    Promise.resolve(createPatientReport(req, res)).catch(next);
  }
);

// Get all patient reports (physician or admin)
router.get(
  '/',
  authenticate,
  authorize(['physician', 'admin']),
  (req, res, next) => {
    Promise.resolve(getAllPatientReports(req, res)).catch(next);
  }
);

// Get a specific patient report by ID (physician or admin)
router.get(
  '/:id',
  authenticate,
  authorize(['physician', 'admin']),
  (req, res, next) => {
    Promise.resolve(getPatientReportById(req, res)).catch(next);
  }
);

export default router;