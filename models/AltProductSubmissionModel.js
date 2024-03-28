const mongoose = require("mongoose");

const AltProductSubSchema = new mongoose.Schema(
  {
    article: { type: String, required: true },
    article_name: { type: String, required: true },
    cat: { type: String, required: true },
    uom: { type: String, required: true },
    tp: { type: Number, required: true },
    quantity: { type: Number, required: true },
    margin: { type: Number, required: true },
    discounter_price: {type: Number, required: true},
    outlet_name: {
      type: String,
      required: true
    },
    outlet_code: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

const AltProductSub = mongoose.model("AltProductSub", AltProductSubSchema);

module.exports = AltProductSub;
