const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store_code: { type: String, required: true },
  article_code: { type: String, required: true },
  store_name: { type: String, required: true },
  article_name: { type: String, required: true },
  mrp: { type: Number, required: true },
  cogs: { type: Number, required: true },
  min_mrp: { type: Number, required: true },
  time: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;