const { getFilm, getFilms, getStudio, getActor, getReviews, getUserAgent } = require('../../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('films routes', () => {
  it('gets all films', async() => {
    const films = await getFilms();

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toHaveLength(films.length);
        films.forEach(film => {
          expect(res.body).toContainEqual({
            _id: film._id,
            title: film.title,
            released: film.released,
            studio: expect.any(Object)
          });
        });
      });
  });

  it('gets a film by id', async() => {
    const film = await getFilm();
    const reviews = await getReviews({ film: film._id });

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body.reviews).toHaveLength(reviews.length);
        expect(res.body).toEqual({
          title: film.title,
          studio: expect.any(Object),
          released: film.released,
          cast: expect.any(Array),
          reviews: expect.any(Array)
        });
      });
  });

  it('requires user to add a new film', async() => {
    const studio = await getStudio();
    const actor = await getActor();

    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'Megaman Returns',
        studio: studio._id,
        released: 2016,
        cast: {
          role: 'Megaman',
          actor: actor._id
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'jwt must be provided',
          status: 500
        });
      });
  });

  it('can add a new film', async() => {
    const studio = await getStudio();
    const actor = await getActor();

    return getUserAgent()
      .post('/api/v1/films')
      .send({
        title: 'Megaman Returns',
        studio: studio._id,
        released: 2016,
        cast: {
          role: 'Megaman',
          actor: actor._id
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Megaman Returns',
          studio: studio._id,
          released: 2016,
          cast: [{
            _id: expect.any(String),
            role: 'Megaman',
            actor: actor._id
          }],
          __v: 0
        });
      });
  });
});
