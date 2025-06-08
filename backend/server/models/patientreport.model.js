import mongoose from 'mongoose';

const patientReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  prescription: { type: String, required: true },
  followUpDate: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

const PatientReport = mongoose.model('PatientReport', patientReportSchema);
export default PatientReport; 