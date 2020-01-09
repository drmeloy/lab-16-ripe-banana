const { getReview, getReviews, getReviewer, getFilm, getUserAgent } = require('../../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('reviews routes', () => {
  it('gets all reviews', async() => {
    const reviews = await getReviews();

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        res.body.forEach(review => {
          expect(reviews).toContainEqual(expect.objectContaining({
            _id: review._id,
            film: expect.any(String),
            rating: review.rating,
            review: review.review
          }));
        });
      });
  });

  it('limits to 100 reviews', async() => {
    return request(app)
      .get('/api/v1/reviews')
      .then(reviews => {
        expect(reviews.body).toHaveLength(100);
      });
  });

  it('returns the top reviews', async() => {
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body[0]).toHaveProperty('rating', 5);
        expect(res.body[99]).toHaveProperty('rating', 1);
      });
  });

  it('requires a user to create a new review', async() => {
    const reviewer = await getReviewer();
    const film = await getFilm();

    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 5,
        reviewer: reviewer._id,
        review: 'Like OMG so good WTF',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'jwt must be provided',
          status: 500
        });
      });
  });

  it('can create a new review', async() => {
    const reviewer = await getReviewer();
    const film = await getFilm();

    return getUserAgent()
      .post('/api/v1/reviews')
      .send({
        rating: 5,
        reviewer: reviewer._id,
        review: 'Like OMG so good WTF',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 5,
          reviewer: reviewer._id,
          review: 'Like OMG so good WTF',
          film: film._id,
          __v: 0
        });
      });
  });

  it('requires a user to delete a review', async() => {
    const review = await getReview();

    return request(app)
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'jwt must be provided',
          status: 500
        });
      });
  });

  it('can delete a review', async() => {
    const review = await getReview();

    return getUserAgent()
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: review._id,
          rating: review.rating,
          reviewer: review.reviewer,
          review: review.review,
          film: review.film,
          __v: 0
        });
      });
  });
});
