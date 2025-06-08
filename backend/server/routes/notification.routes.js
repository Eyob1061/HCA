import express from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

/**
 * @typedef {import('express').Request & { user: { _id: string; role: string } }} AuthenticatedRequest
 */

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/** @type {import('express').Router} */
const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new notification
router.post('/', /** @type {RequestHandler} */ (req, res) => {
  createNotification(/** @type {AuthenticatedRequest} */ (req), res);
});

// Get notifications for the current user
router.get('/', /** @type {RequestHandler} */ (req, res) => {
  getNotifications(/** @type {AuthenticatedRequest} */ (req), res);
});

// Mark a notification as read
router.patch('/:notificationId/read', /** @type {RequestHandler} */ (req, res) => {
  markAsRead(/** @type {AuthenticatedRequest} */ (req), res);
});

// Mark all notifications as read
router.patch('/read-all', /** @type {RequestHandler} */ (req, res) => {
  markAllAsRead(/** @type {AuthenticatedRequest} */ (req), res);
});

// Delete a notification
router.delete('/:notificationId', /** @type {RequestHandler} */ (req, res) => {
  deleteNotification(/** @type {AuthenticatedRequest} */ (req), res);
});

export default router; 