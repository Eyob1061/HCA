import PatientReport from '../models/patientreport.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPatientReport = async (req, res) => {
  try {
    let { patientId: bodyPatientId, diagnosis, treatment, prescription, followUpDate, notes } = req.body;
    let patientId = bodyPatientId;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      const patient = await User.findOne({ patientId: patientId });
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      patientId = patient._id;
    }
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    if (patient.accountStatus !== 'active') {
      return res.status(403).json({ success: false, message: 'Patient account is not active. Please contact administrator.' });
    }
    const report = new PatientReport({
      patientId,
      diagnosis,
      treatment,
      prescription,
      followUpDate,
      notes
    });
    const savedReport = await report.save();
    res.status(201).json({ success: true, message: 'Report generated successfully', data: savedReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating report', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 