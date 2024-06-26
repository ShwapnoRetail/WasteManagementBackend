const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')

// constroller functions
const {
    getOfferProducts,
    getOfferProduct,
    createProductOffer,
    getOfferProductByOulet,
    createManyProductOffer,
    getTodaysOfferProductByOulet
} = require('../controllers/productOfferController')


 // requireAuth for all routes
 router.use(requireAuth)


 // get  all offer products
 router.get('/', getOfferProducts)

 // get  all offer products by specific outlet
 router.get('/outlet/:id', getOfferProductByOulet)


 // get  all offer products by specific outlet
 router.get('/todaySubmission', getTodaysOfferProductByOulet)

 // get single product
router.get('/:id',getOfferProduct)
 
 // upload products
 router.post('/', createProductOffer)

 // upload products
 router.post('/createall', createManyProductOffer)
 
 module.exports = router