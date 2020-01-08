require('dotenv').config();
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

let actor;
let studio;
let film;
beforeEach(async() => {
  actor = await Actor.create({
    name: 'Megaman',
    dob: new Date('1988-09-02T06:00:00.000Z'),
    pob: 'Boise'
  });

  studio = await Studio.create({
    name: 'Boise Studios'
  });

  film = await Film.create({
    title: 'The Megaman Story',
    studio: studio.id,
    released: 2015,
    cast: [{
      role: 'Megaman',
      actor: actor.id
    }]
  });

});

afterAll(() => {
  return mongoose.connection.close();
});