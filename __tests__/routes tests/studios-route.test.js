const { getStudio, getStudios, getFilms, getUserAgent } = require('../../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('studios routes', () => {
  it('gets all studios', async() => {
    const studios = await getStudios();

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toHaveLength(studios.length);
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id,
            name: studio.name
          });
        });
      });
  });

  it('gets a studio by id', async() => {
    await getFilms();
    const studio = await getStudio();

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id,
          name: studio.name,
          address: studio.address,
          films: expect.any(Array)
        });
      });
  });

  it('requires a user to add a new studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({
        name: 'Portland Studios',
        address: {
          city: 'Portland',
          state: 'Idaho',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'jwt must be provided',
          status: 500
        });
      });
  });

  it('can add a new studio', () => {
    return getUserAgent()
      .post('/api/v1/studios')
      .send({
        name: 'Portland Studios',
        address: {
          city: 'Portland',
          state: 'Idaho',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Portland Studios',
          address: {
            city: 'Portland',
            state: 'Idaho',
            country: 'USA'
          },
          __v: 0
        });
      });
  });
});
