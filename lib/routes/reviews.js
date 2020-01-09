const { Router } = require('express');
const Review = require('../../lib/models/Review');
const ensureAuth = require('../middleware/ensure-auth');

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
  .post('/', ensureAuth, (req, res, next) => {
    Review
      .create(req.body)
      .then(review => res.send(review))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review))
      .catch(next);
  });
