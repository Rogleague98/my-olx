import express from 'express';
import Notification from '../models/Notification';
import { authMiddleware } from '../middleware/auth';
import { io, userSockets } from '../server';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a notification
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, type, message, link } = req.body;
    if (!userId || !type || !message) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const notification = await Notification.create({ userId, type, message, link });
    // Emit real-time event
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit('new_notification', notification);
    }
    res.status(201).json(notification);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark a notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get unread notification count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 