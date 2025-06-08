import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
/**
 * @typedef {Object} IUser
 * @property {string} fullName
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {('admin'|'patient'|'physician')} role
 * @property {('active'|'inactive'|'suspended')}accountStatus
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string|null|undefined} [patientId] // Only for patients
 * @property {number|null|undefined} [age] // Only for patients
 * @property {string|null|undefined} [condition] // Only for patients
 * @property {Date|null|undefined} [lastVisit] // Only for patients
 * @property {string|null|undefined} [status] // Only for patients
 * @property {string|null|undefined} [phone] // Only for patients
 * @property {string|null|undefined} [address] // Only for patients
 */

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'patient', 'physician'],
    required: true 
   },
  accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
  // Patient-specific fields (validation for patients is handled in the controller)
  patientId: {
    type: String,
    required: false,
    unique: false,
    sparse: true
  },
  age: {
    type: Number,
    required: false,
  },
  condition: {
    type: String,
    required: false,
  },
  lastVisit: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
}, {
  timestamps: true
});

/** @type {import('mongoose').Model<import('./user.model').IUser>} */
const User = mongoose.model('User', userSchema);

export default User;