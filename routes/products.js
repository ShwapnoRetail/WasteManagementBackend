const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')
// constroller functions
const { 
    
    getProducts,
    uploadProducts,
    getProduct 
} = require('../controllers/productController')

 // requireAuth for all routes
router.use(requireAuth)


// get  all products
router.get('/', getProducts)

// get single product
router.get('/:id',getProduct)

// upload products
router.post('/', uploadProducts)

module.exports = router