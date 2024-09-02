const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const AltProductModel = require("../../models/AltProductModel");

// Create and Save a new SalesData entry
const createPNPInvoiceData = async (req, res) => {
  // try {
  //   // console.log(req.user);

  //   const bodyPnpInvData = req.body;
  //   const allProducts = await AltProductModel.find();
  //   // console.log(allProducts);
  //   bodyPnpInvData.map((item) => {
  //     const productDetails = allProducts.find((product) => product.article === item.article);

  //     // console.log(productDetails);
  //     item.cat = productDetails?productDetails.cat : "N/A";
  //   });
  //   const existingData = await PNPInvoiceModel.findOne({
  //     invoice_date: bodyPnpInvData[0].invoice_date,
  //   });

  //   if (existingData) {
  //     // Optionally, you can update the existing entry here instead of skipping
  //     await PNPInvoiceModel.updateOne(
  //       { _id: existingData._id },
  //       {
  //         $set: {
  //           invoice_date: bodyPnpInvData[0].invoice_date,
  //           invoice_data: bodyPnpInvData,
  //         },
  //       }
  //     );
  //   } else {
  //     console.log({
  //       invoice_date: bodyPnpInvData[0].invoice_date,
  //       invoice_data: bodyPnpInvData,
  //     });
  //     const newData = await PNPInvoiceModel.create({
  //       invoice_date: bodyPnpInvData[0].invoice_date,
  //       invoice_data: bodyPnpInvData,
  //     });
  //   }

  //   //   const savedInvoiceData = await PNPInvoiceModel.insertMany(req.body);
  //   res.status(201).json({ message: "Data Saved Successfully" });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: error.message });
  // }

  const bodyData = req.body;

  console.log(bodyData?.length);

  try {
    // Find the document by date

    for (let i = 0; i < bodyData.length; i++) {
      let { data, date } = bodyData[i];
      console.log(i);

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
