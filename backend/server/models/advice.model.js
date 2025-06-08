import mongoose from 'mongoose';
/**
 * @typedef {Object} IAdvice
 * @property {mongoose.Types.ObjectId} patientId - Reference to the patient
 * @property {string} condition - Medical condition
 * @property {string} medications - Medications
 * @property {string} lifestyle - Lifestyle
 * @property {('Low'|'Normal'|'High'| 'Urgent')} urgencyLevel 
 * @property {('pending'|'approved'|'rejected')} status
 * @property {Date} createdAt
 * @property {Date} updatedAt

 */

const adviceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  condition: {
    type: String,
    required: [true, 'Medical condition is required'],
    trim: true
  },
  medications: {
    type: String,
    required: [true, 'Medications are required'],
    trim: true
  },
  lifestyle: {
    type: String,
    trim: true,
    default: ''
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: {
      values: ['Low', 'Normal', 'High', 'Urgent'],
      message: 'Invalid urgency level'
    },
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
adviceSchema.index({ patientId: 1, createdAt: -1 });
adviceSchema.index({ department: 1, urgencyLevel: 1 });

/** @type {import('mongoose').Model<import('./advice.model').IAdvice>} */
const Advice = mongoose.model('Advice', adviceSchema);

export default Advice;