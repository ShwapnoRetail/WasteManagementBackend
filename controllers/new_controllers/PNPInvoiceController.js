const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const AltProductModel = require("../../models/AltProductModel");

// Create and Save a new SalesData entry
const createPNPInvoiceData = async (req, res) => {


  const bodyData = req.body;


  try {
    // Find the document by date

    for (let i = 0; i < bodyData.length; i++) {
      let { data, date } = bodyData[i];
      // console.log(i);

      try {
        const result = await PNPInvoiceModel.findOneAndUpdate(
          { invoice_date: date }, // Match by date
          { $set: { invoice_data:data } }, // Update the data array
          { new: true, upsert: true, setDefaultsOnInsert: true } // Create if not exists, return new document
        );

        // res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error("Error updating or creating data:", error);
        // res
        //   .status(500)
        //   .json({ success: false, message: "Internal Server Error" });
      }
    }

    res.status(200).json({
      success: true,
      message: "Data Saved Successfully",
    });
  } catch (error) {
    console.error("Error updating or creating data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createPNPInvoiceData,
};
