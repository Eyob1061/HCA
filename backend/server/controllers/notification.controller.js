import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

/**
 * @typedef {import('express').Request & { user: { _id: string; role: string } }} AuthenticatedRequest
 */

/**
 * Create a new notification
 * @param {AuthenticatedRequest} req
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

    // Basic validation (can be enhanced with libraries like Joi/Express-validator)
    if (!type || !title || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields: type, title, message' });
    }

    // If targeting a specific user, create and save a single notification
    if (targetUserId) {
        const notification = new Notification({
            type,
            title,
            message,
            urgency,
            targetRole: targetRole || 'all', // Default to 'all' if role is not provided for user target
            targetUserId,
            sourceUserId: req.user._id,
            relatedEntityId,
            metadata
        });
        await notification.save();
        return res.status(201).json({ success: true, data: notification });
    }

    // If targeting a role, find users and create multiple notifications
    if (targetRole) {
        const targetUsers = await User.find({ role: targetRole });

        if (targetUsers.length === 0) {
            return res.status(404).json({ success: false, error: `No users found with role: ${targetRole}` });
        }

        // @ts-ignore: user object structure from Mongoose find
        const notificationsToInsert = targetUsers.map(/** @param {{ _id: import('mongoose').Types.ObjectId }} user */ user => ({
            type,
            title,
            message,
            urgency,
            targetRole,
            targetUserId: user._id, // Assign the specific user's ID
            sourceUserId: req.user._id,
            relatedEntityId,
            metadata,
            createdAt: new Date(), // Set creation time
            status: 'unread' // Default status
        }));

        const result = await Notification.insertMany(notificationsToInsert);

        return res.status(201).json({
            success: true,
            data: result
        });

    } else {
        // If neither targetUserId nor targetRole is provided, maybe target the source user or all?
        // This part depends on your desired default behavior if no target is specified.
        // For now, let's return an error or default to targeting the source user.
         return res.status(400).json({ success: false, error: 'Either targetUserId or targetRole must be provided' });

        /* Example: Default to source user
        const notification = new Notification({
            type,
            title,
            message,
            urgency,
            targetRole: req.user.role, // Or 'user'
            targetUserId: req.user._id,
            sourceUserId: req.user._id,
            relatedEntityId,
            metadata
        });
        await notification.save();
        return res.status(201).json({ success: true, data: notification });
        */
    }

  } catch (/** @type {unknown} */ error) {
    console.error('Error creating notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Check if it's a duplicate key error again just in case
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
         res.status(409).json({ success: false, error: 'Duplicate entry or conflict.' });
    } else {
         res.status(500).json({ success: false, error: errorMessage });
    }
  }
};

/**
 * Get notifications for the current user
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 */
export const getNotifications = async (req, res) => {
  try {
    const { status, limit = '20', page = '1' } = req.query;
    /** @type {{ $or: Array<{ targetRole?: string; targetUserId?: string }>; status?: string }} */
    const query = {
      $or: [
        { targetRole: req.user.role },
        { targetUserId: req.user._id }
      ]
    };

    if (status && typeof status === 'string') {
      query.status = status;
    }

    const limitNum = parseInt(String(limit), 10);
    const pageNum = parseInt(String(page), 10);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('sourceUserId', 'fullName');

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (/** @type {unknown} */ error) {
    console.error('Error fetching notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

/**
 * Mark notification as read
 * @param {AuthenticatedRequest} req
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
  } catch (/** @type {unknown} */ error) {
    console.error('Error marking notification as read:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

/**
 * Mark all notifications as read
 * @param {AuthenticatedRequest} req
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
  } catch (/** @type {unknown} */ error) {
    console.error('Error marking all notifications as read:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

/**
 * Delete a notification
 * @param {AuthenticatedRequest} req
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
  } catch (/** @type {unknown} */ error) {
    console.error('Error deleting notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}; 