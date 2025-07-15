import express from 'express';
import User from '../models/User';
import { Request, Response } from 'express';
import Listing from '../models/Listing';
import { authMiddleware, adminCheck } from '../middleware/auth';
import { Types } from 'mongoose';

const router = express.Router();

// Test auth endpoint
// @ts-ignore
router.get('/test-auth', authMiddleware, (req: Request, res: Response) => {
  res.json({ 
    message: 'Authenticated!', 
    userId: (req as any).userId,
    headers: req.headers.authorization ? 'Token present' : 'No token'
  });
});

// Favorites routes - MUST come before /:id routes to avoid conflicts
// @ts-ignore
router.get('/favorites', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('Favorites request - userId:', (req as any).userId);
    const user = await User.findById((req as any).userId).populate('favorites');
    if (!user) {
      console.log('User not found for ID:', (req as any).userId);
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log('User found, favorites:', user.favorites);
    
    // Transform favorites to include id field for frontend compatibility
    const transformedFavorites = user.favorites.map((fav: any) => {
      const favObj = fav.toObject ? fav.toObject() : fav;
      return {
        ...favObj,
        id: favObj._id || favObj.id
      };
    });
    
    res.json(transformedFavorites);
  } catch (error: any) {
    console.error('Error in /favorites:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Add a favorite
// @ts-ignore
router.post('/favorites/:listingId', authMiddleware, async (req: Request, res: Response) => {
  const user = await User.findById((req as any).userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  
  // Validate ObjectId format
  if (!Types.ObjectId.isValid(req.params.listingId)) {
    res.status(400).json({ message: 'Invalid listing ID format' });
    return;
  }
  
  if (!user.favorites.includes(new Types.ObjectId(req.params.listingId))) {
    user.favorites.push(new Types.ObjectId(req.params.listingId));
    await user.save();
  }
  res.json({ success: true });
});

// Remove a favorite
// @ts-ignore
router.delete('/favorites/:listingId', authMiddleware, async (req: Request, res: Response) => {
  const user = await User.findById((req as any).userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  
  // Validate ObjectId format
  if (!Types.ObjectId.isValid(req.params.listingId)) {
    res.status(400).json({ message: 'Invalid listing ID format' });
    return;
  }
  
  user.favorites = user.favorites.filter(
    (id) => id.toString() !== req.params.listingId
  );
  await user.save();
  res.json({ success: true });
});

// Get user profile
router.get('/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  // Only return phone if requester is self or verified
  const requesterId = (req as any).userId;
  let userObj = user.toObject();
  if (requesterId !== user.id && !user.verified) {
    delete userObj.phone;
  }
  res.json(userObj);
});

// Reveal phone number endpoint
router.get('/:id/reveal-phone', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const user = await User.findById(req.params.id).select('phone verified');
  if (!user) return res.status(404).json({ message: 'Not found' });
  const requesterId = (req as any).userId;
  // Only allow if requester is self or verified
  if (requesterId === user.id || user.verified) {
    return res.json({ phone: user.phone });
  }
  return res.status(403).json({ message: 'Not authorized to view phone number' });
});

// Update user profile
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    // Only allow the user to update their own profile
    if ((req as any).userId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
    }
    const { name, email, phone, bio, profilePic, currentPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    // Require current password for verification
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password required' });
    }
    // Import bcrypt at the top if not already
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Proceed with update
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (profilePic) user.profilePic = profilePic;
    await user.save();
    const userObj = user.toObject();
    userObj.id = userObj._id; // Ensure id is present for frontend
    delete (userObj as any).password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/admin/users', authMiddleware, adminCheck, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete a user
router.delete('/admin/users/:id', authMiddleware, adminCheck, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update a user (e.g., promote to admin)
router.patch('/admin/users/:id', authMiddleware, adminCheck, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
