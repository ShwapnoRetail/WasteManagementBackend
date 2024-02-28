const wastageProduct = require("../models/WastageProductModel");
const mongoose = require("mongoose");

// get all
const getWastageProducts = async (req, res) => {

  const user = req.user;
//   console.log(user);
//   console.log(req.body);
  console.log( user.outlet_code);
  const products = await wastageProduct.find({outlet_code: user.outlet_code})

  res.status(200).json(products);
};


// create product
// const uploadWastageProducts = async (req, res) => {
//     console.log(req.body[0]);
//     try {
//       // Delete all existing documents
//       await wastageProduct.deleteMany();
  
//       // Extract the bulk data from the request body
//       const bulkData = req.body;
  
//       // Insert the new bulk data
//       await wastageProduct.insertMany(bulkData);
  
//       res.status(200).json({ message: "Bulk data uploaded successfully." });
//     } catch (error) {
//       console.error(error);
//       res.status(404).json({ message: "Failed to upload bulk data." });
//     }
//   };
  
const uploadWastageProducts = async (req, res) => {
  console.log(req.body[0]);
  try {
    // Extract the bulk data and chunk count from the request body
    const { chunkCount, bulkData } = req.body;

    if (chunkCount === 1) {
      // If it's the first chunk, delete existing data
      await wastageProduct.deleteMany();
    }

    // Insert the new bulk data
    await wastageProduct.insertMany(bulkData);

    res.status(200).json({ message: "Bulk data uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to upload bulk data." });
  }
};



module.exports = {
    getWastageProducts,
    uploadWastageProducts
  };
  