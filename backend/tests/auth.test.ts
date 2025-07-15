import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User';

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  let userId: string;
  let token: string;

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Auth Test', email: 'authtest@example.com', password: 'password' });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('authtest@example.com');
    userId = res.body.user.id;
    token = res.body.token;
  });

  it('should login the user', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'authtest@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'authtest@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });
}); 