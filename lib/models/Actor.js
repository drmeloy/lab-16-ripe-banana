const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  pob: String
});

module.exports = mongoose.model('Actor', schema);
