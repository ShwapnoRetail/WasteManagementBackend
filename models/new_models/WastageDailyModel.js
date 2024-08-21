const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WastageDailySchema = new Schema(
  {
    wastage_date: {
      type: Date,
      required: true,
    },
    wastage_data: [
      {
        wastage_date: {
          type: Date,
          required: true,
        },
        outlet_code: {
          type: String,
          required: true,
        },
        outlet_name: {
          type: String,
          required: true,
        },
        article: {
          type: String,
          required: true,
        },
        article_name: {
          type: String,
          required: true,
        },
        cat: {
          type: String,
          required: true,
        },
        movement: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const WastageDaily = mongoose.model("WastageDaily", WastageDailySchema);

module.exports = WastageDaily;
