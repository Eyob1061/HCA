import mongoose from 'mongoose';

/**
 * @typedef {Object} INotification
 * @property {string} type - Type of notification ('advice_request', 'feedback', 'appointment', 'system')
 * @property {string} title - Title of the notification
 * @property {string} message - Content of the notification
 * @property {('low'|'normal'|'high'|'urgent')} urgency - Urgency level of the notification
 * @property {('unread'|'read')} status - Read status of the notification
 * @property {('admin'|'physician'|'patient'|'receptionist')} targetRole - Role of users who should receive this notification
 * @property {mongoose.Types.ObjectId} [targetUserId] - Optional specific user to target
 * @property {mongoose.Types.ObjectId} sourceUserId - User who created the notification
 * @property {mongoose.Types.ObjectId} [relatedEntityId] - Optional reference to related entity
 * @property {Map<string, any>} metadata - Additional metadata for the notification
 * @property {Date} createdAt - When the notification was created
 * @property {Date} [readAt] - When the notification was read
 */

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['advice_request', 'feedback', 'appointment', 'system']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  targetRole: {
    type: String,
    required: true,
    enum: ['admin', 'physician', 'patient', 'receptionist']
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, for specific user targeting
  },
  sourceUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Optional, for linking to related entities (advice request, feedback, etc.)
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date,
    default: null
  }
});

// Index for efficient querying
notificationSchema.index({ targetRole: 1, status: 1, createdAt: -1 });
notificationSchema.index({ targetUserId: 1, status: 1, createdAt: -1 });

/** @type {import('mongoose').Model<import('./Notification').INotification>} */
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 