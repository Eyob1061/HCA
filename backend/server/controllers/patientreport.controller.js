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

/**
 * Get all patient reports
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllPatientReports = async (req, res) => {
  try {
    const reports = await PatientReport.find({})
      .populate('patientId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    // Format the response to include patient details
    const formattedReports = reports.map(report => ({
      _id: report._id,
      patientName: report.patientId ? 
        `${report.patientId.firstName} ${report.patientId.lastName}` : 'Unknown',
      patientId: report.patientId?._id || 'N/A',
      email: report.patientId?.email || 'N/A',
      phone: report.patientId?.phone || 'N/A',
      diagnosis: report.diagnosis || 'No diagnosis',
      treatment: report.treatment || 'No treatment specified',
      prescription: report.prescription || 'No prescription',
      followUpDate: report.followUpDate || null,
      notes: report.notes || 'No additional notes',
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    res.status(200).json({ 
      success: true, 
      data: formattedReports 
    });
  } catch (error) {
    console.error('Error fetching patient reports:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patient reports', 
      error: error.message 
    });
  }
};

/**
 * Get a single patient report by ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPatientReportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid report ID' 
      });
    }

    const report = await PatientReport.findById(id)
      .populate('patientId', 'firstName lastName email phone dateOfBirth gender');

    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: 'Report not found' 
      });
    }

    // Format the response
    const formattedReport = {
      _id: report._id,
      patientName: report.patientId ? 
        `${report.patientId.firstName} ${report.patientId.lastName}` : 'Unknown',
      patientId: report.patientId?._id || 'N/A',
      dateOfBirth: report.patientId?.dateOfBirth || null,
      gender: report.patientId?.gender || 'Not specified',
      email: report.patientId?.email || 'N/A',
      phone: report.patientId?.phone || 'N/A',
      diagnosis: report.diagnosis || 'No diagnosis',
      treatment: report.treatment || 'No treatment specified',
      treatmentPlan: report.treatment, // For backward compatibility
      prescription: report.prescription || 'No prescription',
      followUpDate: report.followUpDate || null,
      notes: report.notes || 'No additional notes',
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    };

    res.status(200).json({ 
      success: true, 
      data: formattedReport 
    });
  } catch (error) {
    console.error('Error fetching patient report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patient report', 
      error: error.message 
    });
  }
};