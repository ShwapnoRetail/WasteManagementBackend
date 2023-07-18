const ProdctOffer = require('../models/ProductOfferModel');
const mongoose = require('mongoose')

// get all
const getOfferProducts = async (req, res) => {
    // console.log(req.user);
    try{
        const products = await ProdctOffer.find()
        res.status(200).json(products)
    }catch(error){
        res.status(400).json({error: error.message})
    }
    
}

// get single Product offer
const getOfferProduct = async (req, res) => {
    const {id} = req.params
      if(!mongoose.Types.ObjectId.isValid(id)){
          return res.status(404).json({error:'No Such product'})
      }
  
      const product = await ProdctOffer.findById(id)
  
      if(!product) {
          return res.status(404).json({error: 'No such product'})
      }
  
      res.status(200).json(product)
  
  }


// create a new 
const createProductOffer = async (req,res) => {
    const {new_mrp,reason,so_quantity,image,article,article_name,min_mrp,outlet_name,outlet_division,email_id,created_at,outlet_code} = req.body
    
  
    // add doc to db
    try{
        // const user_id = req.user._id
        
        const  offerProduct = await ProdctOffer.create({new_mrp,reason,so_quantity,image,article,article_name,min_mrp,outlet_name,outlet_division,email_id,created_at,outlet_code})
        // console.log(offerProduct);
        res.status(200).json(offerProduct)
    }catch(error){
        res.status(400).json({error: error.message})
    }
    
}


module.exports = {
    getOfferProducts,
    getOfferProduct,
    createProductOffer
  }