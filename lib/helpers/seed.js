const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Studio = require('../models/Studio');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const chance = require('chance').Chance();
const User = require('../models/User');

module.exports = async({ studio = 5, reviewer = 10, actor = 20, film = 5, review = 110 } = {}) => {
  await User.create({
    email: 'test@test.com',
    password: 'password'
  });

  await User.create({
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin'
  });

  const studios = await Studio.create([...Array(studio)].map(() => ({
    name: chance.name(),
    address: {
      city: chance.city(),
      state: chance.state(),
      country: chance.country()
    }
  })));

  const reviewers = await Reviewer.create([...Array(reviewer)].map(() => ({
    name: chance.name(),
    company: chance.company()
  })));

  const actors = await Actor.create([...Array(actor)].map(() => ({
    name: chance.name(),
    pob: chance.city(),
    dob: chance.date()
  })));

  const films = await Film.create([...Array(film)].map(() => ({
    title: chance.word(),
    released: chance.year(),
    studio: chance.pickone(studios.map(studio => studio._id)),
    cast: [{
      role: chance.character(),
      actor: chance.pickone(actors.map(actor => actor._id))
    }, {
      role: chance.character(),
      actor: chance.pickone(actors.map(actor => actor._id))
    }]
  })));

  await Review.create([...Array(review)].map(() => ({
    rating: chance.integer({ min: 1, max: 5 }),
    reviewer: chance.pickone(reviewers.map(reviewer => reviewer._id)),
    review: chance.sentence(),
    film: chance.pickone(films.map(film => film._id))
  })));
};
