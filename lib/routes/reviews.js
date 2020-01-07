const { Router } = require('express');
const Review = require('../../lib/models/Review');

module.exports = Router()
  .get('/', (req, res, next) => {
    Review
      .find()
      .populate('film', { title: true })
      .select({ reviewer: false, __v: 0 })
      .sort({ 'rating': -1 })
      .limit(100)
      .then(reviews => res.send(reviews))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    Review
      .create(req.body)
      .then(review => res.send(review))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review))
      .catch(next)
  });
