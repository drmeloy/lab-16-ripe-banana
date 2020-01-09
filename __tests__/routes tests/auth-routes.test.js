const { getUser } = require('../../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('auth routes', () => {
  it('creates a new user with default role of user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          role: 'user',
          __v: 0
        });
      });
  });

  it('logs users and admins in', async() => {
    const user = await getUser({ role: 'user' });
    const admin = await getUser({ role: 'admin' });

    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          email: 'test@test.com',
          role: 'user',
          __v: 0
        });
      });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@admin.com',
        password: 'admin',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: admin._id,
          email: 'admin@admin.com',
          role: 'admin',
          __v: 0
        });
      });
  });

  it('fails to log in with bad email', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'wrong@wrong.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email or Password',
          status: 401
        });
      });
  });

  it('fails to log in with bad password', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrong'
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email or Password',
          status: 401,
        });
      });
  });
});
