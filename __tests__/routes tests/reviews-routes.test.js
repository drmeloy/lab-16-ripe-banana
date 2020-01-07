require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');

describe('reviews routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let review;
  let reviewer;
  let film;
  let studio;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Boise Studios'
    });
    
    film = await Film.create({
      title: 'The Megaman Story',
      studio: studio.id,
      released: 2015,
    });

    reviewer = await Reviewer.create({
      name: 'Megaman',
      company: 'Super Reviews'
    });

    review = await Review.create({
      rating: 5,
      reviewer: reviewer.id,
      review: 'By far the most meaningful film I have ever had the priviledge to witness.',
      film: film.id
    });
  });

  it('gets all reviews', () => {
    return request(app)
      .get('/api/v1/reviews')
      .then(reviews => {
        expect(reviews.body).toEqual([{
          _id: review.id,
          rating: 5,
          review: 'By far the most meaningful film I have ever had the priviledge to witness.',
          film: {
            _id: film.id,
            title: 'The Megaman Story'
          }
        }]);
      });
  });

  it('limits to 100 reviews', () => {
    const filledArray = new Array(110).fill({
      rating: 5,
      reviewer: reviewer.id,
      review: 'By far the most meaningful film I have ever had the priviledge to witness.',
      film: film.id
    });
    
    Review.create(filledArray);

    return request(app)
      .get('/api/v1/reviews')
      .then(reviews => {
        expect(reviews.body).toHaveLength(100);
      });
  });

  it('returns the top reviews', () => {
    let fiveReviews = [];
    for(let i = 0; i < 4; i++){
      const review = {
        rating: i + 1,
        reviewer: reviewer.id,
        review: 'By far the most meaningful film I have ever had the priviledge to witness.',
        film: film.id
      };

      fiveReviews.push(review);
    }
    
    expect(review).toHaveProperty('rating', 5);
    expect(fiveReviews[0]).toHaveProperty('rating', 1);
    expect(fiveReviews[1]).toHaveProperty('rating', 2);
    expect(fiveReviews[2]).toHaveProperty('rating', 3);
    expect(fiveReviews[3]).toHaveProperty('rating', 4);

    Review.create(fiveReviews);

    return request(app)
      .get('/api/v1/reviews')
      .then(reviews => {        
        expect(reviews.body[0]).toHaveProperty('rating', 5);
        expect(reviews.body[1]).toHaveProperty('rating', 4);
        expect(reviews.body[2]).toHaveProperty('rating', 3);
        expect(reviews.body[3]).toHaveProperty('rating', 2);
        expect(reviews.body[4]).toHaveProperty('rating', 1);
      });
  });

  it('can create a new review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 5,
        reviewer: reviewer.id,
        review: 'Like OMG so good WTF',
        film: film.id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 5,
          reviewer: reviewer.id,
          review: 'Like OMG so good WTF',
          film: film.id,
          __v: 0
        });
      });
  });

  it('can delete a review', () => {
    return request(app)
      .delete(`/api/v1/reviews/${review.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: review.id,
          rating: 5,
          reviewer: reviewer.id,
          review: 'By far the most meaningful film I have ever had the priviledge to witness.',
          film: film.id,
          __v: 0
        });
      });
  });
});
