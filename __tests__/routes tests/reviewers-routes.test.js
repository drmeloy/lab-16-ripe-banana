require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../../lib/models/Reviewer');
const Review = require('../../lib/models/Review');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');

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
  let review;
  let studio;
  let film;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Megaman',
      company: 'Super Reviews'
    });

    studio = await Studio.create({
      name: 'Boise Studios'
    });

    film = await Film.create({
      title: 'The Megaman Story',
      studio: studio.id,
      released: 2015
    });

    review = await Review.create({
      rating: 5,
      reviewer: reviewer.id,
      review: 'Supah good',
      film: film.id
    });
  });

  it('gets all reviewers', () => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(reviewers => {
        expect(reviewers.body).toEqual([{
          _id: reviewer.id,
          name: 'Megaman',
          company: 'Super Reviews'
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
          reviews: [{
            _id: review.id,
            rating: 5,
            review: 'Supah good',
            film: {
              _id: film.id,
              title: 'The Megaman Story'
            }
          }]
        });
      });
  });

  it('can create a new reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'Protoman',
        company: 'Portland Studios'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Protoman',
          company: 'Portland Studios',
          __v: 0
        });
      });
  });

  it('can update a reviewer', () => {
    return request(app)
      .patch(`/api/v1/reviewers/${reviewer.id}`)
      .send({ name: 'Rock' })
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer.id,
          name: 'Rock',
          company: 'Super Reviews',
          __v: 0
        });
      });
  });

  it('can delete a reviewer with no reviews', async() => {
    const emptyReviewer = await Reviewer
      .create({
        name: 'Nogood Nobody',
        company: 'Boring'
      });
    
    return request(app)
      .delete(`/api/v1/reviewers/${emptyReviewer.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: emptyReviewer.id,
          name: 'Nogood Nobody',
          company: 'Boring',
          __v: 0
        });
      });
  });

  it('cannot delete a reviewer with reviews', () => {
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer.id}`)
      .then(res => {
        expect(res.status).toEqual(500);
      });
  });
});
