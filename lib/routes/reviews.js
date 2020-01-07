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
  });
