import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User';

let token: string;
let userId: string;

beforeAll(async () => {
  // Register user for testing
  const res = await request(app).post('/auth/register').send({ name: 'User Test', email: 'usertest@example.com', password: 'password' });
  userId = res.body.user.id;
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User API', () => {
  it('should login the user', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'usertest@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fetch user profile', async () => {
    const res = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('usertest@example.com');
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });

  it('should delete the user', async () => {
    const res = await request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
}); 