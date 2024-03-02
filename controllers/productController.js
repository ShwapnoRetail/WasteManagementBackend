const Product = require("../models/ProductModel");
const mongoose = require("mongoose");

// get all
const getProducts = async (req, res) => {
  const currentHour = new Date().getHours();
  const currentMint = new Date().getMinutes();
  const currentTime =parseFloat(`${currentHour}.${currentMint}`);


  console.log(parseFloat(req.user.active_hour) ,currentTime ,  parseFloat(req.user.inactive_hour));

  if (parseFloat(req.user.active_hour) <= currentTime && currentTime  <= parseFloat(req.user.inactive_hour)) {
    const outletDiv = req.outlet.outlet_division;
    // console.log(outletDiv);
    const products = await Product.find({ outlet_division: outletDiv });
    res.status(200).json(products);
  } else {
    res.status(200).json([]);
  }
};

// get all
const getAdminProducts = async (req, res) => {
  // console.log(req.outlet.outlet_division);
  // const outletDiv = req.outlet.outlet_division
  // console.log(outletDiv);
  const products = await Product.find();
  res.status(200).json(products);
};

// get single Product
const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such product" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

// create product
const uploadProducts = async (req, res) => {
  try {
    // Delete all existing documents
    await Product.deleteMany();

    // Extract the bulk data from the request body
    const bulkData = req.body;

    // Insert the new bulk data
    await Product.insertMany(bulkData);

    res.status(200).json({ message: "Bulk data uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to upload bulk data." });
  }
};

// create product
const deleteProducts = async (req, res) => {
  try {
    // Delete all existing documents
    await Product.deleteMany();

    res.status(200).json({ message: "Bulk data deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to delete data." });
  }
};

module.exports = {
  getProducts,
  uploadProducts,
  getProduct,
  deleteProducts,
  getAdminProducts,
};
