const { getActor, getActors, getFilms } = require('../../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('actors routes', () => {
  it('gets all actors', async() => {
    const actors = await getActors();

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toHaveLength(actors.length);
        actors.forEach(actor => {
          delete actor.__v;
          delete actor.pob;
          delete actor.dob;
          expect(res.body).toContainEqual(actor);
        });
      });
  });

  it('gets an actor by id', async() => {
    const actor = await getActor();
    await getFilms();

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: actor.name,
          dob: actor.dob,
          pob: actor.pob,
          films: expect.any(Array)
        });
      });
  });

  it('can add a new actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Danger Dan',
        pob: 'Boise',
        dob: new Date('1999-09-02T06:00:00.000Z')
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Danger Dan',
          pob: 'Boise',
          dob: '1999-09-02T06:00:00.000Z',
          __v: 0
        });
      });
  });
});
