const Actor = require('../../lib/models/Actor');

describe('Actor model', () => {
  it('requires a name', () => {
    const actor = new Actor({
      dob: new Date('September 2, 1988'),
      pob: 'Boise'
    });

    const { errors } = actor.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});
