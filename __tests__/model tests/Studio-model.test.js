const Studio = require('../../lib/models/Studio');

describe('Studio model', () => {
  it('requires a name', () => {
    const studio = new Studio({
      address: {
        city: 'Boise',
        state: 'Idaho',
        country: 'USA'
      }
    });

    const { errors } = studio.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});
