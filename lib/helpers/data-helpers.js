require('dotenv').config();
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const request = require('supertest');
const app = require('../app');
const Studio = require('../models/Studio');
const Reviewer = require('../models/Reviewer');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');
const User = require('../models/User');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(async() => {
  return seed();
});

const userAgent = request.agent(app);
const adminAgent = request.agent(app);
beforeEach(async() => {
  await userAgent
    .post('/api/v1/auth/login')
    .send({ email: 'test@test.com', password: 'password' });

  return adminAgent
    .post('/api/v1/auth/login')
    .send({ email: 'admin@admin.com', password: 'admin' });
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`]: (query) => Model.findOne(query).then(prepare),
    [`get${modelName}s`]: (query) => Model.find(query).then(docs => docs.map(prepare)),
    getUserAgent: () => userAgent,
    getAdminAgent: () => adminAgent,
    getUser: (query) => User.findOne(query).then(prepare),

  };
};

module.exports = {
  ...createGetters(Studio),
  ...createGetters(Reviewer),
  ...createGetters(Actor),
  ...createGetters(Film),
  ...createGetters(Review)
};
