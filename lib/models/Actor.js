const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  pob: String
});

schema.virtual('films', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'cast.actor'
});

schema.statics.findActorById = function(id){
  return this
    .findById(id)
    .lean()
    .populate('films', { _id: true, title: true, released: true });
};

schema.statics.cleanUp = function(actor){
  delete actor._id;
  delete actor.__v;
  actor.films.forEach(film => {
    delete film.cast;
  });
}

module.exports = mongoose.model('Actor', schema);
