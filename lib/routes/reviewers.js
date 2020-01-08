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
  })
  .post('/', (req, res, next) => {
    Reviewer
      .create(req.body)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Reviewer
      .findReviews(req.params.id)
      .then(reviews => {        
        if(!reviews[0]){
          Reviewer
            .findByIdAndDelete(req.params.id)
            .then(reviewer => res.send(reviewer));
        } else {
          throw 'Cannot delete reviewer that has reviews';
        }
      })
      .catch(next);
  });
