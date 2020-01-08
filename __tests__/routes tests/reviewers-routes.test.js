const { getReviewer, getReviewers, getReviews, getReview } = require('../../lib/helpers/data-helpers');
const Review = require('../../lib/models/Review');
const request = require('supertest');
const app = require('../../lib/app');

describe('reviewers routes', () => {
  it('gets all reviewers', async() => {
    const reviewers = await getReviewers();

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toHaveLength(reviewers.length);
        reviewers.forEach(reviewer => {
          delete reviewer.__v;
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });

  it('gets a reviewer by id', async() => {
    let reviewer = await getReviewer();
    const reviews = await getReviews({ reviewer: reviewer._id });

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body.reviews).toHaveLength(reviews.length);
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: reviewer.name,
          company: reviewer.company,
          reviews: expect.any(Array)
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

  it('can update a reviewer', async() => {
    const reviewer = await getReviewer();

    return request(app)
      .patch(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'Rock' })
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: 'Rock',
          company: reviewer.company,
          __v: 0
        });
      });
  });

  it('can delete a reviewer with no reviews', async() => {
    const emptyReviewer = await getReviewer();
    await Review.deleteMany({ reviewer: emptyReviewer._id });
    
    return request(app)
      .delete(`/api/v1/reviewers/${emptyReviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: emptyReviewer._id,
          name: emptyReviewer.name,
          company: emptyReviewer.company,
          __v: 0
        });
      });
  });

  it('cannot delete a reviewer with reviews', async() => {
    const review = await getReview();
    const reviewer = await getReviewer({ _id: review.reviewer });

    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.status).toEqual(500);
      });
  });
});
