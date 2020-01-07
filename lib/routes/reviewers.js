const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ __v: false })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Reviewer
      .findReviewerById(req.params.id)
      .then(([reviewer, reviews]) => {
        reviewer.reviews = reviews;
        res.send(reviewer);
      })
      .catch(next);
  });
