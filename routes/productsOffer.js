const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')

// constroller functions
const {
    getOfferProducts,
    getOfferProduct,
    createProductOffer 
} = require('../controllers/productOfferController')


 // requireAuth for all routes
 router.use(requireAuth)


 // get  all offer products
 router.get('/', getOfferProducts)

 // get single product
router.get('/:id',getOfferProduct)
 
 // upload products
 router.post('/', createProductOffer)
 
 module.exports = router