require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');

describe('films routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let film;
  let studio;
  let actor;
  let review;
  let reviewer;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Boise Studios'
    });
    
    actor = await Actor.create({
      name: 'Megaman'
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

    reviewer = await Reviewer.create({
      name: 'Megaman',
      company: 'Super Reviews'
    });

    review = await Review.create({
      rating: 5,
      reviewer: reviewer.id,
      review: 'The most meaningful film ever made.',
      film: film.id
    });
  });

  it('gets all films', () => {
    return request(app)
      .get('/api/v1/films')
      .then(films => {
        expect(films.body).toEqual([{
          _id: film.id,
          title: 'The Megaman Story',
          studio: {
            _id: studio.id,
            name: 'Boise Studios'
          },
          released: 2015
        }]);
      });
  });

  it('gets a film by id', () => {
    return request(app)
      .get(`/api/v1/films/${film.id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: 'The Megaman Story',
          studio: {
            _id: studio.id,
            name: 'Boise Studios'
          },
          released: 2015,
          cast: [{
            _id: expect.any(String),
            role: 'Megaman',
            actor: {
              _id: actor.id,
              name: 'Megaman'
            }
          }],
          reviews: [{
            _id: review.id,
            rating: 5,
            review: 'The most meaningful film ever made.',
            reviewer: {
              _id: reviewer.id,
              name: 'Megaman'
            }
          }]
        });
      });
  });
});
