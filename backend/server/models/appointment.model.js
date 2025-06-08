import mongoose from 'mongoose';
/**
 * @typedef {Object} IAppointment
 * @property {mongoose.Types.ObjectId} patientId - Reference to the patient making the appointment
 * @property {mongoose.Types.ObjectId} physicianId - Reference to the physician making the appointment
 * @property {('General Medicine'|'Blood Test'|'Diabetis Test'|'Cancer Test')} department
 * @property {Date} date - Date of the appointment
 * @property {string} time - Time slot of the appointment (e.g., "09:00", "14:30")
 * @property {string} reason - Reason for the appointment
 * @property {('scheduled'|'completed'|'cancelled'|'no-show')} status - Status of the appointment
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  physicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Physician ID is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['General Medicine', 'Blood Test', 'Diabetis Test', 'Cancer Test'],
      message: 'Invalid department selected'
    }
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      /**
       * Validates that the appointment date is not in the past
       * @param {Date} date - The appointment date to validate
       * @returns {boolean} - True if the date is valid (not in the past)
       */
      validator: function(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date.getTime() >= today.getTime(); // Cannot book appointments in the past
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    validate: {
      /**
       * Validates that the appointment time is in the correct format and within business hours
       * @param {string} time - The appointment time to validate (format: HH:MM)
       * @returns {boolean} - True if the time is valid
       */
      validator: function(time) {
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) return false;
        
        // Convert to minutes for easier comparison
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        // Check if time is within business hours (8 AM to 5 PM)
        return timeInMinutes >= 8 * 60 && timeInMinutes <= 17 * 60;
      },
      message: 'Invalid appointment time. Please select a time between 8:00 AM and 5:00 PM'
    }
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'completed', 'cancelled', 'no-show'],
      message: 'Invalid appointment status'
    },
    default: 'scheduled'
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ physicianId: 1, date: 1, time: 1 }, { unique: true });

/** @type {import('mongoose').Model<import('./appointment.model').IAppointment>} */
const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;