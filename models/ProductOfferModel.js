const mongoose = require('mongoose');

const offerProductSchema = new mongoose.Schema({
  article_code: {
    type: String,
    required: true
  },
  cogs: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  min_mrp: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  av_quantity: {
    type: Number,
    required: true
  },
  so_quantity: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  new_mrp: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  store_code: {
    type: String,
    required: true
  },
  store_name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  created_at: {
    type: String,
    required: true
  }
});

const OfferProduct = mongoose.model('OfferProduct', offerProductSchema);

module.exports = OfferProduct;
