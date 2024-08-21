const mongoose = require('mongoose');

const SalesDataSchema = new mongoose.Schema({
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

const SalesData = mongoose.model('SalesData', SalesDataSchema);

module.exports = SalesData;
