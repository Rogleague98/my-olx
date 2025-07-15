import express from 'express';
import Message from '../models/Message';
import { authMiddleware } from '../middleware/auth';
import { io, userSockets } from '../server';

const router = express.Router();

// Send a message
router.post('/', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { recipientId, listingId, content } = req.body;
    if (!recipientId || !listingId || !content) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const senderId = (req as any).userId;
    const message = await Message.create({ senderId, recipientId, listingId, content });
    // Emit real-time event
    const socketId = userSockets.get(recipientId);
    if (socketId) {
      io.to(socketId).emit('new_message', message);
    }
    res.status(201).json(message);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get conversation between two users for a listing
router.get('/conversation', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const { userId: otherUserId, listingId } = req.query;
    if (!otherUserId || !listingId) {
      res.status(400).json({ message: 'Missing userId or listingId' });
      return;
    }
    const messages = await Message.find({
      listingId,
      $or: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all messages for the logged-in user
router.get('/', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { recipientId: userId },
      ],
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark all messages in a conversation as read
router.patch('/read', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { listingId, userId: otherUserId } = req.body;
    if (!listingId || !otherUserId) {
      res.status(400).json({ message: 'Missing listingId or userId' });
      return;
    }
    await Message.updateMany(
      {
        listingId,
        senderId: otherUserId,
        recipientId: userId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get unread message count for the logged-in user
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const count = await Message.countDocuments({ recipientId: userId, isRead: false });
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 