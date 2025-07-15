import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import Message from '../models/Message';
import User from '../models/User';
import Listing from '../models/Listing';

let token: string;
let userId: string;
let otherUserId: string;
let listingId: string;

beforeAll(async () => {
  // Create users and listing for testing
  const userRes = await request(app).post('/auth/register').send({ name: 'Test User', email: 'testuser@example.com', password: 'password' });
  userId = userRes.body.user.id;
  token = userRes.body.token;
  const otherUserRes = await request(app).post('/auth/register').send({ name: 'Other User', email: 'otheruser@example.com', password: 'password' });
  otherUserId = otherUserRes.body.user.id;
  const listingRes = await request(app)
    .post('/listings')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test Listing',
      description: 'A test listing',
      price: 100,
      category: 'Electronics',
      subcategory: 'Phones',
      images: [],
    });
  listingId = listingRes.body._id || listingRes.body.id;
});

afterAll(async () => {
  await Message.deleteMany({});
  await User.deleteMany({});
  await Listing.deleteMany({});
  await mongoose.connection.close();
});

describe('Messages API', () => {
  let messageId: string;

  it('should send a message', async () => {
    const res = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: otherUserId, listingId, content: 'Hello!' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Hello!');
    messageId = res.body._id;
  });

  it('should fetch all messages for the user', async () => {
    const res = await request(app)
      .get('/messages')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(m => m.content === 'Hello!')).toBe(true);
  });

  it('should fetch conversation between two users for a listing', async () => {
    const res = await request(app)
      .get(`/messages/conversation?userId=${otherUserId}&listingId=${listingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('Hello!');
  });

  it('should mark messages as read', async () => {
    const res = await request(app)
      .patch('/messages/read')
      .set('Authorization', `Bearer ${token}`)
      .send({ listingId, userId: otherUserId });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should get unread message count', async () => {
    const res = await request(app)
      .get('/messages/unread-count')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.count).toBe('number');
  });
}); 