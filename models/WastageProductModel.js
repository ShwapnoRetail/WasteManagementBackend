const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // store_code: { type: String, required: true },
  outlet_code: { type: String, required: true },
  article: { type: String, required: true },
  description: { type: String, required: true },
  cat: { type: String, required: true },
  sales_amount: { type: String, required: true },
  wastage_amount: { type: String, required: true },
  percentage: { type: String, required: true },
});

const WastageProduct = mongoose.model("wastageProduct", productSchema);

module.exports = WastageProduct;
