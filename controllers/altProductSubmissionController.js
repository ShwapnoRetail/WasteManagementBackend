const AltProductSub = require("../models/AltProductSubmissionModel");

const getAltSubs = async (req, res) => {
  const products = await AltProductSub.find().lean();

  //   console.log(updatedProducts[0]);
  res.status(200).json(products);
};

// create product
const createAltProductsSub = async (req, res) => {
  try {
    // Extract the bulk data from the request body
    const {
      article,
      article_name,
      cat,
      uom,
      tp,
      quantity,
      margin,
      discounter_price,
      outlet_name,
      outlet_code,
      new_mrp,
    } = req.body;
    // console.log(data);
    // Insert the new bulk data
    await AltProductSub.create({
      article,
      article_name,
      cat,
      uom,
      tp,
      quantity,
      margin,
      discounter_price,
      outlet_name,
      outlet_code,
      new_mrp,
    });

    res.status(200).json({ message: "data submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to upload data." });
  }
};

// Define your controller function
const fetchDataByOutletAndDate = async (req, res) => {
  // console.log("hello");
  try {
    // Extract outlet code and date from request parameters or query
    const { outlet_code, date } = req.body;

    // console.log(outlet_code, date);

    // Parse the date string to get the date part only
    const datePart = date.split("T")[0];

    if (outlet_code !== "N/A") {
      // Fetch data from MongoDB based on outlet code and date
      const data = await AltProductSub.find({
        outlet_code: outlet_code,
        createdAt: {
          $gte: new Date(datePart), // Start of the specified date
          $lt: new Date(
            new Date(datePart).setDate(new Date(datePart).getDate() + 1)
          ), // Start of the next date
        },
      });

      // console.log("in if",data);

      // Respond with the fetched data
      res.status(200).json(data);
    } else {
      // Fetch data from MongoDB based on outlet code and date
      const data = await AltProductSub.find({
        // outlet_code: outlet_code,
        createdAt: {
          $gte: new Date(datePart), // Start of the specified date
          $lt: new Date(
            new Date(datePart).setDate(new Date(datePart).getDate() + 1)
          ), // Start of the next date
        },
      });

      // console.log("in else",data);

      // Respond with the fetched data
      res.status(200).json(data);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAltProductsSub,
  getAltSubs,
  fetchDataByOutletAndDate,
};
