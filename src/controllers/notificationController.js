import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Create a new notification
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createNotification = async (req, res) => {
  try {
    const {
      type,
      title,
      message,
      urgency,
      targetRole,
      targetUserId,
      relatedEntityId,
      metadata
    } = req.body;

    const notification = new Notification({
      type,
      title,
      message,
      urgency,
      targetRole,
      targetUserId,
      sourceUserId: req.user._id,
      relatedEntityId,
      metadata
    });

    await notification.save();

    // If targetUserId is provided, send to specific user
    if (targetUserId) {
      return res.status(201).json({
        success: true,
        data: notification
      });
    }

    // If targetRole is provided, send to all users with that role
    const targetUsers = await User.find({ role: targetRole });
    const notifications = targetUsers.map(user => ({
      ...notification.toObject(),
      targetUserId: user._id
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get notifications for the current user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getNotifications = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const query = {
      $or: [
        { targetRole: req.user.role },
        { targetUserId: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sourceUserId', 'fullName');

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        $or: [
          { targetRole: req.user.role },
          { targetUserId: req.user._id }
        ]
      },
      {
        status: 'read',
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { targetRole: req.user.role },
          { targetUserId: req.user._id }
        ],
        status: 'unread'
      },
      {
        status: 'read',
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Delete a notification
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      $or: [
        { targetRole: req.user.role },
        { targetUserId: req.user._id }
      ]
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 