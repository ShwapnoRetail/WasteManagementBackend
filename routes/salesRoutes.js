const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// constroller functions
const {
  createSalesAndWastageData,
  getSalesAndWastageDataByDateRange,
  getSalesAndWastageDataByDateRangeOutlets,
  getSalesAndWastageDataByDateRangeCat,
  getSalesAndWastageDataByDateRangeArticle
} = require("../controllers/new_controllers/SalesDataController");

const {
    getDashboardSalesAndWastageDataByDateRangeArticle
} = require("../controllers/new_controllers/PNPDashboardController");


// requireAuth for all routes
router.use(requireAuth);

// get  all
router.get("/sales-wastage", getSalesAndWastageDataByDateRange);
router.get("/sales-wastage-outlets", getSalesAndWastageDataByDateRangeOutlets);
router.get("/sales-wastage-cat", getSalesAndWastageDataByDateRangeCat);
router.get("/sales-wastage-articles", getSalesAndWastageDataByDateRangeArticle);


// dashbarod
router.get("/dashboard-articles", getDashboardSalesAndWastageDataByDateRangeArticle);




// post  all
router.post("/sales-wastage", createSalesAndWastageData);

module.exports = router;
