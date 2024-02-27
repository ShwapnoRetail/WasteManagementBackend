const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
// constroller functions
const {
    getWastageProducts,
    uploadWastageProducts
} = require("../controllers/wastageProductController");

// requireAuth for all routes
router.use(requireAuth);

// get  all products
router.get("/", getWastageProducts);


// upload products
router.post("/", uploadWastageProducts);

module.exports = router;
