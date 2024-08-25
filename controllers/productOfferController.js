const ProdctOffer = require("../models/ProductOfferModel");
const mongoose = require("mongoose");

const getOfferProducts = async (req, res) => {
  const { selectedDate } = req.query;


  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const products = await ProdctOffer.aggregate([
      {
        $match: {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get single Product offer
const getOfferProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such product" });
  }

  const product = await ProdctOffer.findById(id);

  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

// get all Product offer by outlet
const getOfferProductByOulet = async (req, res) => {
  const { id } = req.params;

  // console.log(id);

  const itemArray = id.split("_");

  const email = itemArray[0] + "om@acilogistics.net"
  const selectedDate = itemArray[1]

  // console.log(({email,selectedDate}));

  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // const datePattern = new RegExp(`^${selectedDate}`);



  // const product = await ProdctOffer.find({
  //   email_id: { $regex: new RegExp(email, 'i') },
  //   created_at: { $regex: datePattern },
  // });

  const product = await ProdctOffer.aggregate([
      {
        $match: {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

  // console.log(product);
 

  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }

  res.status(200).json(product);
};


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const getTodaysOfferProductByOulet = async (req, res) => {

  const code = req.user.outlet_code
  const selectedDate = formatDate(new Date())
  // const datePattern = new RegExp(`^${selectedDate}`);

  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const product = await ProdctOffer.aggregate([
    {
      $match: {
        created_at: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        outlet_code: code
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // console.log(product);
 

  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }

  res.status(200).json(product);
};
// create a new
const createProductOffer = async (req, res) => {
  const {
    new_mrp,
    reason,
    so_quantity,
    image,
    article,
    article_name,
    min_mrp,
    outlet_name,
    outlet_division,
    email_id,
    created_at,
    outlet_code,
  } = req.body;

  // add doc to db
  try {
    // const user_id = req.user._id

    const offerProduct = await ProdctOffer.create({
      new_mrp,
      reason,
      so_quantity,
      image,
      article,
      article_name,
      min_mrp,
      outlet_name,
      outlet_division,
      email_id,
      created_at,
      outlet_code,
    });
    // console.log(offerProduct);
    res.status(200).json(offerProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// create a new
const createManyProductOffer = async (req, res) => {

  // add doc to db
  try {
    // const user_id = req.user._id
    const offerProduct = await ProdctOffer.create(req.body);
    // console.log(offerProduct);
    res.status(200).json(offerProduct);
    // console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getOfferProducts,
  getOfferProduct,
  createProductOffer,
  getOfferProductByOulet,
  createManyProductOffer,
  getTodaysOfferProductByOulet
};
