const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// constroller functions
const {
    createPNPInvoiceData
} = require("../controllers/new_controllers/PNPInvoiceController");

// requireAuth for all routes
router.use(requireAuth);

// // get  all
// router.get("/sales-wastage", getSalesAndWastageDataByDateRange);

// // get  all
// router.get("/sales-wastage-by-date", getSalesAndWastageDataBySingleDate);

// post  all
router.post("/create", createPNPInvoiceData);

module.exports = router;
