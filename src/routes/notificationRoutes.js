import express from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create a new notification
router.post('/', createNotification);

// Get notifications for the current user
router.get('/', getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete a notification
router.delete('/:notificationId', deleteNotification);

export default router; 