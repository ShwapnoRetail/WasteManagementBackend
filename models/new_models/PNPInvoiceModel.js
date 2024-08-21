const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PNPInvoiceSchema = new Schema(
  {
    invoice_date: {
      type: Date,
      required: true,
    },
    invoice_data: [
      {
        invoice_date: {
          type: Date,
          required: true,
        },
        invoice_no: {
          type: String,
          required: true,
        },
        outlet_code: {
          type: String,
          required: true,
        },
        article: {
          type: String,
          required: true,
        },
        cat: {
          type: String,
          required: true,
        },
        sales_qty: {
          type: Number,
          required: true,
        },
        sales_tp: {
          type: Number,
          required: true,
        },
        nsi: {
          type: Number,
          required: true,
        },
        bill_time: {
          type: String,
          default: ""
          // required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PNPInvoice = mongoose.model("PNPInvoice", PNPInvoiceSchema);

module.exports = PNPInvoice;
