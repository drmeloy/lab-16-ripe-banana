const Reviewer = require('../../lib/models/Reviewer');

describe('Reviewer model', () => {
  it('requires a name', () => {
    const reviewer = new Reviewer({
      company: 'Super Reviews'
    });

    const { errors } = reviewer.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('requires a company', () => {
    const reviewer = new Reviewer({
      name: 'Megaman'
    });

    const { errors } = reviewer.validateSync();

    expect(errors.company.message).toEqual('Path `company` is required.');
  });
});
