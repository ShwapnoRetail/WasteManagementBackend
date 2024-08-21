const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// constroller functions
const {
    getInvoiceAndOfferProducts,
    getWastageProductsSummed
} = require("../controllers/serviceController");

// requireAuth for all routes
router.use(requireAuth);

// get  all
router.get("/invoice-projection", getInvoiceAndOfferProducts);
router.get("/wastage-products-summed", getWastageProductsSummed);

// // get  all
// router.get("/sales-wastage-by-date", getSalesAndWastageDataBySingleDate);

// // post  all
// router.post("/sales-wastage", createSalesAndWastageData);

module.exports = router;
