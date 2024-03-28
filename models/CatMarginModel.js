const mongoose = require("mongoose");

const CatMarginSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    margin: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CatMargin = mongoose.model("CatMargin", CatMarginSchema);

module.exports = CatMargin;
