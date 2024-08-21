const mongoose = require('mongoose');

const offerProductSchema = new mongoose.Schema({


  new_mrp: {    // new data
    type: String,
    required: true
  }, 

  reason: {   // new data
    type: String,
    required: true
  },

  // av_quantity: {   // new data
  //   type: Number,
  //   required: true
  // },

  so_quantity: {   // new data
    type: Number,
    required: true
  },

  image: {   // new data
    type: String,
    default: "https://placehold.co/600x400?text=No+Image+Uploaded"
  },

  article: {
    type: String,
    required: true
  },

  
  article_name: {
    type: String,
    required: true
  },

  min_mrp: {
    type: Number,
    required: true
  },

  outlet_name: {
    type: String,
    required: true
  },
  outlet_code: {
    type: String,
    required: true
  },

  outlet_division: {
    type: String,
    required: true
  },

  email_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  }
});

const OfferProduct = mongoose.model('OfferProduct', offerProductSchema);

module.exports = OfferProduct;
