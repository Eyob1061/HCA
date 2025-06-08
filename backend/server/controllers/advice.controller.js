// @ts-nocheck
// Remove: import { Request, Response } from 'express';
import Advice from '../models/advice.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Create a new advice request
 */
export const createAdvice = async (req, res) => {
  try {
    let { patientId: bodyPatientId, condition, medications, lifestyle, urgencyLevel } = req.body;
    let patientId = bodyPatientId;

    // If not a valid ObjectId, resolve by patient code
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      const patient = await User.findOne({ patientId: patientId });
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      patientId = patient._id;
    }

    // Now, patientId is always an ObjectId
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    if (patient.accountStatus !== 'active') {
      return res.status(403).json({ success: false, message: 'Patient account is not active. Please contact administrator.' });
    }

    const advice = new Advice({
      patientId,
      condition,
      medications,
      lifestyle,
      urgencyLevel,
      status: 'pending'
    });

    const savedAdvice = await advice.save();

    res.status(201).json({
      success: true,
      message: 'Advice submitted successfully',
      data: savedAdvice
    });
  } catch (error) {
    console.error('Error in createAdvice:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting advice',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all advice requests (for admin/physician)
 */
export const getAllAdvice = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};

    // If user is a physician, only show advice from their department
    if (role === 'physician') {
      query.department = req.user.department;
    }

    const advice = await Advice.find(query)
      .populate('patientId', 'patientId fullName email')
      .sort({ urgencyLevel: -1, createdAt: -1 });

    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Error in getAllAdvice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching advice requests',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get advice requests for a specific patient
 */
export const getPatientAdvice = async (req, res) => {
  try {
    const patientId = req.user._id;
    const advice = await Advice.find({ patientId, status: 'approved' })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Error in getPatientAdvice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient advice requests',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single advice request by ID
 */
export const getAdviceById = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id)
      .populate('patientId', 'fullName email');

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: 'Advice request not found'
      });
    }

    // Check if user has permission to view this advice
    if (req.user.role !== 'admin' && 
        req.user.role !== 'physician' && 
        advice.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this advice request'
      });
    }

    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Error in getAdviceById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching advice request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update advice request
 */
export const updateAdvice = async (req, res) => {
  try {
    const { subject, description, urgencyLevel } = req.body;
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: 'Advice request not found'
      });
    }

    // Only the patient who created the advice can update it
    if (advice.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this advice request'
      });
    }

    // Update fields
    if (subject) advice.subject = subject;
    if (description) advice.description = description;
    if (urgencyLevel) advice.urgencyLevel = urgencyLevel;

    const updatedAdvice = await advice.save();

    res.json({
      success: true,
      message: 'Advice request updated successfully',
      data: updatedAdvice
    });
  } catch (error) {
    console.error('Error in updateAdvice:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating advice request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete advice request
 */
export const deleteAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: 'Advice request not found'
      });
    }

    // Only the patient who created the advice or admin can delete it
    if (req.user.role !== 'admin' && 
        advice.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this advice request'
      });
    }

    await advice.deleteOne();

    res.json({
      success: true,
      message: 'Advice request deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteAdvice:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting advice request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get advice requests by urgency level
 */
export const getAdviceByUrgency = async (req, res) => {
  try {
    const { urgencyLevel } = req.params;
    
    // Validate urgency level
    const validLevels = ['Low', 'Normal', 'High', 'Urgent'];
    if (!validLevels.includes(urgencyLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid urgency level'
      });
    }

    const advice = await Advice.find({ urgencyLevel })
      .populate('patientId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('Error in getAdviceByUrgency:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching advice requests',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const approveAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);
    if (!advice) {
      return res.status(404).json({ success: false, message: 'Advice not found' });
    }
    advice.status = 'approved';
    await advice.save();
    res.json({ success: true, message: 'Advice approved', data: advice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving advice', error: error.message });
  }
};

export const rejectAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);
    if (!advice) {
      return res.status(404).json({ success: false, message: 'Advice not found' });
    }
    advice.status = 'rejected';
    await advice.save();
    res.json({ success: true, message: 'Advice rejected', data: advice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting advice', error: error.message });
  }
}; 