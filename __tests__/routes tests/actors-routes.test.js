require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../../lib/models/Actor');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');

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
  let studio;
  let film;
  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Megaman',
      dob: new Date('1988-09-02T06:00:00.000Z'),
      pob: 'Boise'
    });

    studio = await Studio.create({
      name: 'Boise Studios'
    });

    film = await Film.create({
      title: 'The Megaman Story',
      studio: studio.id,
      released: 2015,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });
  });

  it('gets all actors', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([{
          _id: actor.id,
          name: 'Megaman'
        }]);
      });
  });

  it('gets an actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Megaman',
          dob: '1988-09-02T06:00:00.000Z',
          pob: 'Boise',
          films: [{
            _id: film.id,
            title: 'The Megaman Story',
            released: 2015
          }]
        });
      });
  });

  it('can add a new actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Danger Dan',
        pob: 'Boise',
        dob: new Date('1999-09-02T06:00:00.000Z')
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Danger Dan',
          pob: 'Boise',
          dob: '1999-09-02T06:00:00.000Z',
          __v: 0
        });
      });
  });
});
