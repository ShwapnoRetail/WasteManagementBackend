const AltProduct = require("../models/AltProductModel");
const CatMargin = require("../models/CatMarginModel");
const mongoose = require("mongoose");


function addMarginToArticles(articles, margins) {
    // Create a map of category to margin for faster lookup
    const marginMap = {};
    margins.forEach(item => {
        marginMap[item.category.toLowerCase()] = item.margin;
    });

    // Loop through each article and add margin based on category
    articles.forEach(article => {
        const categoryMargin = marginMap[article.cat.toLowerCase()];
        if (categoryMargin !== undefined) {
            article.margin = categoryMargin;
        }
    });
    

    return articles;
}

// get all
const getAltProducts = async (req, res) => {
  const products = await AltProduct.find().lean();
  const margins = await CatMargin.find().lean();

  const updatedProducts = addMarginToArticles(products,margins)
//   console.log(updatedProducts[0]);
  res.status(200).json(updatedProducts);
};

// create product
const uploadAltProducts = async (req, res) => {
  try {
    // Delete all existing documents
    await AltProduct.deleteMany();

    // Extract the bulk data from the request body
    const bulkData = req.body;

    // console.log(req.body[0]);

    // Insert the new bulk data
    await AltProduct.insertMany(bulkData);

    res.status(200).json({ message: "Bulk data uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to upload bulk data." });
  }
};


//get margin
const getAllMargin = async (req,res) => {
    const margins = await CatMargin.find();
    res.status(200).json(margins);
}

// create margin
const uploadMargin = async (req, res) => {
  try {
    // Delete all existing documents
    await CatMargin.deleteMany();

    // Extract the bulk data from the request body
    const bulkData = req.body;

    // console.log(req.body);

    // Insert the new bulk data
    await CatMargin.insertMany(bulkData);

    res.status(200).json({ message: "Bulk data uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to upload bulk data." });
  }
};

module.exports = {
  getAltProducts,
  uploadAltProducts,
  getAllMargin,
  uploadMargin,
};
