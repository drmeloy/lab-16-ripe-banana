const { Router } = require('express');
const Film = require('../models/Film');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { name: true })
      .select({ cast: false, __v: false })
      .then(films => res.send(films))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Film
      .findFilmById(req.params.id)
      .then(([film, reviews]) => {
        film.reviews = reviews;
        res.send(film);
      })
      .catch(next);
  })
  .post('/', ensureAuth, (req, res, next) => {
    Film
      .create(req.body)
      .then(film => res.send(film))
      .catch(next);
  });

