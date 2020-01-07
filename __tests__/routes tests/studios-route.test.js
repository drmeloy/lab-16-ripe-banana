require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../../lib/models/Studio');
const Film = require('../../lib/models/Film');

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
  let film;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Boise Studios',
      address: {
        city: 'Boise',
        state: 'Idaho',
        country: 'USA'
      }
    });

    film = await Film.create({
      title: 'The Megaman Story',
      studio: studio.id,
      released: 2015
    });
  });

  it('gets all studios', () => {
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual([{
          _id: studio.id,
          name: 'Boise Studios'
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
          films: [{
            _id: film.id,
            title: 'The Megaman Story'
          }],
          __v: 0
        });
      });
  });
});
