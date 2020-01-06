require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../../lib/models/Reviewer');

describe('reviewers routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let reviewer;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Megaman',
      company: 'Super Reviews'
    });
  });

  it('gets all reviewers', () => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(reviewers => {
        expect(reviewers.body).toEqual([{
          _id: reviewer.id,
          name: 'Megaman',
          company: 'Super Reviews',
          __v: 0
        }]);
      });
  });

  it('gets a reviewer by id', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer.id,
          name: 'Megaman',
          company: 'Super Reviews',
          __v: 0
        });
      });
  });
});
