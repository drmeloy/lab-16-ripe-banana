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

schema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'film'
});

module.exports = mongoose.model('Film', schema);
