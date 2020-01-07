const { Router } = require('express');
const Film = require('../../lib/models/Film');

module.exports = Router()
  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { name: true })
      .select({ cast: false })
      .then(films => res.send(films))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .populate('studio', { name: true })
      .populate('cast.actor', { name: true })
      .populate('reviews')
      .populate('reviews.reviewer', { name: true })
      .lean()
      .then(film => {
        film.reviews.forEach(review => {
          delete review.__v;
          delete review.film;
        });
        res.send(film);
      })
      .catch(next);
  });

