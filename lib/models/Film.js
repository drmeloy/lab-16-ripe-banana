const mongoose = require('mongoose');

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1888,
    max: 9999
  },
  cast: [{
    role: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

schema.statics.findFilmById = function(id){
  return Promise.all([
    this
      .findById(id)
      .select({ _id: false, __v: false })
      .populate('studio', { name: true })
      .populate('cast.actor', { name: true })
      .lean(),
    this.model('Review')
      .find({ film: id })
      .select({ film: false, __v: false })
      .populate('reviewer', { name: true })
  ]);
};

module.exports = mongoose.model('Film', schema);
