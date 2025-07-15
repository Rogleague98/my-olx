import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}

export async function adminCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      res.status(403).json({ message: 'Forbidden: Admins only' });
      return;
    }
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
    return;
  }
}
