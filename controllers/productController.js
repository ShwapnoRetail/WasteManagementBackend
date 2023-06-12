const Product = require('../models/ProductModel')
const mongoose = require('mongoose');

// get all
const getProducts = async (req, res) => {
    // console.log(req.user);
    const outletCode = req.outlet.outletCode
    console.log(outletCode);
    const products = await Product.find({store_code: outletCode})
    res.status(200).json(products)
}

// get single Product 
const getProduct = async (req, res) => {
  const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No Such product'})
    }

    const product = await Product.findById(id)

    if(!product) {
        return res.status(404).json({error: 'No such producr'})
    }

    res.status(200).json(product)

}

// create product

const uploadProducts = async (req, res) => {
    try {
      // Delete all existing documents
      await Product.deleteMany();
  
      // Extract the bulk data from the request body
      const bulkData = req.body;
  
      // Insert the new bulk data
      await Product.insertMany(bulkData);
  
      res.status(200).json({ message: 'Bulk data uploaded successfully.' });
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Failed to upload bulk data.' });
    }
  };


// create product

// const uploadProducts = async (req, res) => {
//   try {
//     // Delete all existing documents
//     await Product.deleteMany();

//     // Extract the bulk data from the request body
//     const bulkData = req.body;
//     const chunkSize = 5000; // Define the desired chunk size

//     // Split the bulk data into smaller chunks
//     const chunks = [];
//     for (let i = 0; i < bulkData.length; i += chunkSize) {
//       const chunk = bulkData.slice(i, i + chunkSize);
//       chunks.push(chunk);
//     }

//     // Upload the chunks sequentially
//     for (let i = 0; i < chunks.length; i++) {
//       const chunk = chunks[i];
//       await Product.insertMany(chunk);
//     }

//     res.status(200).json({ message: 'Bulk data uploaded successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(404).json({ message: 'Failed to upload bulk data.' });
//   }
// };



  module.exports = {
    getProducts,
    uploadProducts,
    getProduct
  }