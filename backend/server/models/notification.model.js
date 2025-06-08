import mongoose from 'mongoose';

/**
 * @typedef {Object} INotification
 * @property {string} type - Type of notification ('advice_request', 'feedback', 'system_alert', 'user_alert')
 * @property {string} title - Title of the notification
 * @property {string} message - Content of the notification
 * @property {('low'|'medium'|'high')} urgency - Urgency level of the notification
 * @property {('unread'|'read')} status - Read status of the notification
 * @property {('physician'|'admin'|'all')} targetRole - Role of users who should receive this notification
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
    enum: ['advice_request', 'feedback', 'system_alert', 'user_alert']
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
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  targetRole: {
    type: String,
    required: true,
    enum: ['physician', 'admin', 'all']
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sourceUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
notificationSchema.index({ targetRole: 1, status: 1, createdAt: -1 });
notificationSchema.index({ targetUserId: 1, status: 1, createdAt: -1 });

/** @type {import('mongoose').Model<INotification>} */
const Notification = /** @type {any} */ (mongoose.model('Notification', notificationSchema));

export default Notification; 