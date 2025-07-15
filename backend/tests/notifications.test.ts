import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import Notification from '../models/Notification';
import User from '../models/User';

let token: string;
let userId: string;

beforeAll(async () => {
  // Create user for testing
  const userRes = await request(app).post('/auth/register').send({ name: 'Notif User', email: 'notifuser@example.com', password: 'password' });
  userId = userRes.body.user.id;
  token = userRes.body.token;
});

afterAll(async () => {
  await Notification.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Notifications API', () => {
  let notifId: string;

  it('should send a notification', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: userId, message: 'Test notification' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Test notification');
    notifId = res.body._id;
  });

  it('should fetch all notifications for the user', async () => {
    const res = await request(app)
      .get('/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(n => n.message === 'Test notification')).toBe(true);
  });

  it('should get unread notification count', async () => {
    const res = await request(app)
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.count).toBe('number');
  });

  it('should mark notification as read', async () => {
    const res = await request(app)
      .patch(`/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
}); 