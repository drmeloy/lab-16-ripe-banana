require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../../lib/models/Actor');

describe('actors routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let actor;
  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Megaman',
      dob: new Date('September 2, 1988'),
      pob: 'Boise'
    });
  });

  it('gets all actors', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([{
          _id: actor.id,
          name: 'Megaman',
          dob: '1988-09-02T06:00:00.000Z',
          pob: 'Boise',
          __v: 0
        }]);
      });
  });

  it('gets an actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actor.id,
          name: 'Megaman',
          dob: '1988-09-02T06:00:00.000Z',
          pob: 'Boise',
          __v: 0
        });
      });
  });
});
