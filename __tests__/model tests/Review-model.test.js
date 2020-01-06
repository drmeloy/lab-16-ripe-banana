const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');

describe('Review model', () => {
  const studio = new Studio({
    name: 'Boise Studios'
  });

  const reviewer = new Reviewer({
    name: 'Megaman',
    company: 'Super Reviews'
  });

  const film = new Film({
    title: 'The Megaman Story',
    studio: studio.id,
    released: 2015
  });

  it('requires a rating', () => {
    const review = new Review({
      reviewer: reviewer.id,
      review: 'It was the most meaningful movie I have ever had the privilege to see.',
      film: film.id
    });

    const { errors } = review.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('rating has max of 5', () => {
    const review = new Review({
      rating: 6,
      reviewer: reviewer.id,
      review: 'It was the most meaningful movie I have ever had the privilege to see.',
      film: film.id
    });

    const { errors } = review.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (6) is more than maximum allowed value (5).');
  });

  it('rating has min of 1', () => {
    const review = new Review({
      rating: 0,
      reviewer: reviewer.id,
      review: 'It was the most meaningful movie I have ever had the privilege to see.',
      film: film.id
    });

    const { errors } = review.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (0) is less than minimum allowed value (1).');
  });

  it('requires a reviewer', () => {
    const review = new Review({
      rating: 5,
      review: 'It was the most meaningful movie I have ever had the privilege to see.',
      film: film.id
    });

    const { errors } = review.validateSync();

    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });

  it('requires a review', () => {
    const review = new Review({
      rating: 5,
      reviewer: reviewer.id,
      film: film.id
    });

    const { errors } = review.validateSync();

    expect(errors.review.message).toEqual('Path `review` is required.');
  });

  it('review has maximum 140 characters', () => {
    const review = new Review({
      rating: 5,
      reviewer: reviewer.id,
      review: 'a'.repeat(141),
      film: film.id
    });
    
    const { errors } = review.validateSync();

    expect(errors.review.message).toEqual('Path `review` (`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`) is longer than the maximum allowed length (140).');
  });

  it('requires a film', () => {
    const review = new Review({
      rating: 5,
      reviewer: reviewer.id,
      review: 'Super good.'
    });

    const { errors } = review.validateSync();

    expect(errors.film.message).toEqual('Path `film` is required.');
  });
});
