require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../../lib/models/Studio');

describe('studios routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });
  
  let studio;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Boise Studios',
      address: {
        city: 'Boise',
        state: 'Idaho',
        country: 'USA'
      }
    });
  });

  it('gets all studios', () => {
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual([{
          _id: studio.id,
          name: 'Boise Studios',
          address: {
            city: 'Boise',
            state: 'Idaho',
            country: 'USA'
          },
          __v: 0
        }]);
      });
  });

  it('gets a studio by id', () => {
    return request(app)
      .get(`/api/v1/studios/${studio.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio.id,
          name: 'Boise Studios',
          address: {
            city: 'Boise',
            state: 'Idaho',
            country: 'USA'
          },
          __v: 0
        });
      });
  });
});
