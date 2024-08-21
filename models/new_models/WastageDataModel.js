const mongoose = require('mongoose');

const WastageDataSchema = new mongoose.Schema({
  outlet_code: {
    type: String,
    required: true,
  },
  outlet_name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const WastageData = mongoose.model('WastageData', WastageDataSchema);

module.exports = WastageData;
