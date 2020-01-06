const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');

describe('Film model', () => {
  const studio = new Studio({
    name: 'Boise Studios'
  });

  const actor = new Actor({
    name: 'Megaman'
  });

  it('requires a title', () => {
    const film = new Film({
      studio: {
        _id: studio.id,
        name: 'Boise Studios'
      },
      released: 2015,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });

    const { errors } = film.validateSync();

    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('requires a studio', () => {
    const film = new Film({
      name: 'The Megaman Story',
      released: 2015,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });

    const { errors } = film.validateSync();

    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });

  it('requires a release date', () => {
    const film = new Film({
      name: 'The Megaman Story',
      studio: studio.id,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });

    const { errors } = film.validateSync();

    expect(errors.released.message).toEqual('Path `released` is required.');
  });

  it('cannot have been released before 1888', () => {
    const film = new Film({
      name: 'The Megaman Story',
      studio: studio.id,
      released: 1887,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });

    const { errors } = film.validateSync();

    expect(errors.released.message).toEqual('Path `released` (1887) is less than minimum allowed value (1888).');
  });

  it('year cannot be more than 4 digits', () => {
    const film = new Film({
      name: 'The Megaman Story',
      studio: studio.id,
      released: 10000,
      cast: [{
        role: 'Megaman',
        actor: actor.id
      }]
    });

    const { errors } = film.validateSync();

    expect(errors.released.message).toEqual('Path `released` (10000) is more than maximum allowed value (9999).');
  });
});
