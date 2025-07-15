import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User';
import Listing from '../models/Listing';
import Report from '../models/Report';

let userToken: string;
let adminToken: string;
let userId: string;
let adminId: string;
let listingId: string;

beforeAll(async () => {
  // Connect to a test DB
  await mongoose.connect('mongodb://localhost:27017/marketplace_test', { useNewUrlParser: true, useUnifiedTopology: true } as any);
  await User.deleteMany({});
  await Listing.deleteMany({});
  await Report.deleteMany({});
  // Create a user and admin
  const user = await User.create({ name: 'User', email: 'user@example.com', password: 'pass', isAdmin: false });
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'pass', isAdmin: true });
  userId = user._id.toString();
  adminId = admin._id.toString();
  // Create a listing
  const listing = await Listing.create({ title: 'Test Listing', price: 10, description: 'desc', seller: userId });
  listingId = listing._id.toString();
  // Mock tokens (in real tests, use JWT or your auth system)
  userToken = userId;
  adminToken = adminId;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Report API', () => {
  it('should create a report for a listing', async () => {
    const res = await request(app)
      .post('/api/report')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reportedListing: listingId, reason: 'Spam' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.reason).toBe('Spam');
  });
  // More tests to be added...
}); 