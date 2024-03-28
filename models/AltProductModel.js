const mongoose = require("mongoose");

const AltProductSchema = new mongoose.Schema(
  {
    // store_code: { type: String, required: true },
    //   outlet_division: { type: String, required: true },
    article: { type: String, required: true },
    article_name: { type: String, required: true },
    cat: { type: String, required: true },
    uom: { type: String, required: true },
    //   min_margin: { type: String, required: true },
    // time: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("AltProduct", AltProductSchema);

module.exports = Product;
