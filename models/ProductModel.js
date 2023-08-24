const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // store_code: { type: String, required: true },
  outlet_division: { type: String, required: true },
  article: { type: String, required: true },
  article_name: { type: String, required: true },
  cogs: { type: String, required: true },
  min_mrp: { type: String, required: true },
  min_margin: { type: String, required: true },
  // time: { type: String, required: true },
  created_at: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
