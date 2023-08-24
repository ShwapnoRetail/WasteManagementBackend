const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
// constroller functions
const {
  getProducts,
  uploadProducts,
  getProduct,
  getAdminProducts,
  deleteProducts,
} = require("../controllers/productController");

// requireAuth for all routes
router.use(requireAuth);

// get  all products
router.get("/", getProducts);

// get  all products
router.get("/admin", getAdminProducts);

// delete  all products
router.get("/delete", deleteProducts);

// get single product
router.get("/:id", getProduct);

// upload products
router.post("/", uploadProducts);

module.exports = router;
