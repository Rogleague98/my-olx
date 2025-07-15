import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import Listing from '../models/Listing';
import User from '../models/User';

let token: string;
let userId: string;
let listingId: string;

beforeAll(async () => {
  // Create user for testing
  const userRes = await request(app).post('/auth/register').send({ name: 'Listing User', email: 'listinguser@example.com', password: 'password' });
  userId = userRes.body.user.id;
  token = userRes.body.token;
});

afterAll(async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Listings API', () => {
  it('should create a listing', async () => {
    const res = await request(app)
      .post('/listings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'API Test Listing',
        description: 'A test listing',
        price: 200,
        category: 'Electronics',
        subcategory: 'Phones',
        images: [],
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('API Test Listing');
    listingId = res.body._id || res.body.id;
  });

  it('should fetch all listings', async () => {
    const res = await request(app)
      .get('/listings');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(l => l.title === 'API Test Listing')).toBe(true);
  });

  it('should fetch a listing by id', async () => {
    const res = await request(app)
      .get(`/listings/${listingId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('API Test Listing');
  });

  it('should update a listing', async () => {
    const res = await request(app)
      .put(`/listings/${listingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 250 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(250);
  });

  it('should delete a listing', async () => {
    const res = await request(app)
      .delete(`/listings/${listingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
}); 