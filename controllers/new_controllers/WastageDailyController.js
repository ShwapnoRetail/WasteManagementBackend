const WastageDailyModel = require("../../models/new_models/WastageDailyModel");
const AltProductModel = require("../../models/AltProductModel");
// Create and Save a new SalesData entry
const createDailyWastageData = async (req, res) => {
  try {
    // console.log(req.user);

    const bodyWastageData = req.body;

    const existingData = await WastageDailyModel.findOne({
      wastage_date: bodyWastageData[0].wastage_date,
    });


    const allProducts = await AltProductModel.find();
    bodyWastageData.map((item) => {
      const productDetails = allProducts.find((product) => product.article === item.article.toString());

      // console.log(productDetails);
      item.cat = productDetails?productDetails.cat : "N/A";
    });

    if (existingData) {
      // Optionally, you can update the existing entry here instead of skipping
      await WastageDailyModel.updateOne(
        { _id: existingData._id },
        { $set: {
            wastage_date: bodyWastageData[0].wastage_date,
            wastage_data: bodyWastageData,
          } }
      );
    } else {
      // console.log({
      //   wastage_date: bodyWastageData[0].wastage_date,
      //   wastage_data: bodyWastageData,
      // });
      const newData = await WastageDailyModel.create({
        wastage_date: bodyWastageData[0].wastage_date,
        wastage_data: bodyWastageData,
      });
    }

    //   const savedInvoiceData = await WastageDailyModel.insertMany(req.body);
    res.status(201).json({ message: "Data Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDailyWastageData,
};
