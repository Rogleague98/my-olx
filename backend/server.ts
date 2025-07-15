import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import userRoutes from './routes/user';
import path from 'path';
import uploadRoutes from './routes/upload';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import reportRouter from './routes/report';
import healthRouter from './routes/health';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/listings', listingRoutes);
app.use('/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload', uploadRoutes);
app.use('/api/report', reportRouter);
app.use('/health', healthRouter);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// --- Socket.IO setup ---
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }, // Adjust for production
});
const userSockets = new Map<string, string>();

io.on('connection', (socket) => {
  socket.on('register', (userId: string) => {
    userSockets.set(userId, socket.id);
  });
  socket.on('disconnect', () => {
    for (const [userId, sockId] of userSockets.entries()) {
      if (sockId === socket.id) userSockets.delete(userId);
    }
  });
});

export { io, userSockets };
// --- End Socket.IO setup ---

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Example route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

// Socket test route
app.get('/socket-test', (req: Request, res: Response) => {
  res.send('Socket.IO is set up!');
});

// TODO: Add routes for /auth, /listings, /user
