import express from 'express';
import Report from '../models/Report';
import { authMiddleware } from '../middleware/auth';
import User, { IUser } from '../models/User';
import Listing from '../models/Listing';
import { io, userSockets } from '../server';
import mongoose from 'mongoose';

const router = express.Router();

// Submit a report
router.post('/', authMiddleware, async (req, res): Promise<any>  => {
  try {
    const reporter = (req as any).userId;
    const { reportedUser, reportedListing, reason, details } = req.body;
    if (!reason || (!reportedUser && !reportedListing)) {
      return res.status(400).json({ message: 'Reason and at least one of reportedUser or reportedListing are required.' });
    }
    // Validate existence
    if (reportedUser && !(await User.findById(reportedUser))) {
      return res.status(404).json({ message: 'Reported user not found.' });
    }
    if (reportedListing && !(await Listing.findById(reportedListing))) {
      return res.status(404).json({ message: 'Reported listing not found.' });
    }
    const report = await Report.create({ reporter, reportedUser, reportedListing, reason, details });
    // Emit real-time event to all admins
    const admins = await User.find({ isAdmin: true });
    admins.forEach((admin: IUser) => {
      const adminId = (admin._id as mongoose.Types.ObjectId).toString();
      const socketId = userSockets.get(adminId);
      if (socketId) {
        io.to(socketId).emit('new_report', report);
      }
    });
    res.status(201).json(report);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all reports (admin only)
router.get('/', authMiddleware, async (req, res): Promise<any> => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    const reports = await Report.find().populate('reporter reportedUser reportedListing');
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Close a report (admin only)
router.patch('/:id/close', authMiddleware, async (req, res): Promise<any> => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    // Emit real-time event to all admins
    const admins = await User.find({ isAdmin: true });
    admins.forEach((admin: IUser) => {
      const adminId = (admin._id as mongoose.Types.ObjectId).toString();
      const socketId = userSockets.get(adminId);
      if (socketId) {
        io.to(socketId).emit('report_closed', report._id);
      }
    });
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; 