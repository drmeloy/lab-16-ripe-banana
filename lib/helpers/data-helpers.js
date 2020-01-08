require('dotenv').config();
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const Studio = require('../models/Studio');
const Reviewer = require('../models/Reviewer');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(async() => {
  return seed();
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`]: () => Model.findOne().then(prepare),
    [`get${modelName}s`]: () => Model.find().then(docs => docs.map(prepare))
  };
};

module.exports = {
  ...createGetters(Studio),
  ...createGetters(Reviewer),
  ...createGetters(Actor),
  ...createGetters(Film),
  ...createGetters(Review)
};
