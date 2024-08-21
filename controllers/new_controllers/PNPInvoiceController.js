const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const AltProductModel = require("../../models/AltProductModel");

// Create and Save a new SalesData entry
const createPNPInvoiceData = async (req, res) => {
  try {
    // console.log(req.user);

    const bodyPnpInvData = req.body;
    const allProducts = await AltProductModel.find();
    // console.log(allProducts);
    bodyPnpInvData.map((item) => {
      const productDetails = allProducts.find((product) => product.article === item.article);

      // console.log(productDetails);
      item.cat = productDetails?productDetails.cat : "N/A";
    });
    const existingData = await PNPInvoiceModel.findOne({
      invoice_date: bodyPnpInvData[0].invoice_date,
    });

    if (existingData) {
      // Optionally, you can update the existing entry here instead of skipping
      await PNPInvoiceModel.updateOne(
        { _id: existingData._id },
        {
          $set: {
            invoice_date: bodyPnpInvData[0].invoice_date,
            invoice_data: bodyPnpInvData,
          },
        }
      );
    } else {
      console.log({
        invoice_date: bodyPnpInvData[0].invoice_date,
        invoice_data: bodyPnpInvData,
      });
      const newData = await PNPInvoiceModel.create({
        invoice_date: bodyPnpInvData[0].invoice_date,
        invoice_data: bodyPnpInvData,
      });
    }

    //   const savedInvoiceData = await PNPInvoiceModel.insertMany(req.body);
    res.status(201).json({ message: "Data Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPNPInvoiceData,
};
