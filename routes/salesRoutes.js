const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// constroller functions
const {
  createSalesAndWastageData,
  getSalesAndWastageDataByDateRange,
  getSalesAndWastageDataBySingleDate,
  getSalesAndShrinkageDataByDateRange,
  getSalesAndShrinkageDataBySingleDate,

  getSalesAndWastageDataByDateRangeOutlets,
  getSalesAndShrinkageDataByDateRangeOutlets,

  getSalesAndWastageDataByDateRangeCat,
  getSalesAndShrinkageDataByDateRangeCat
} = require("../controllers/new_controllers/SalesDataController");

// requireAuth for all routes
router.use(requireAuth);

// get  all
router.get("/sales-wastage", getSalesAndWastageDataByDateRange);
router.get("/sales-wastage-outlets", getSalesAndWastageDataByDateRangeOutlets);
router.get("/sales-wastage-cat", getSalesAndWastageDataByDateRangeCat);

router.get("/sales-shrinkage", getSalesAndShrinkageDataByDateRange);
router.get("/sales-shrinkage-outlets", getSalesAndShrinkageDataByDateRangeOutlets);
router.get("/sales-shrinkage-cat", getSalesAndShrinkageDataByDateRangeCat);

// get  all
router.get("/sales-wastage-by-date", getSalesAndWastageDataBySingleDate);
// get  all
router.get("/sales-shrinkage-by-date", getSalesAndShrinkageDataBySingleDate);

// post  all
router.post("/sales-wastage", createSalesAndWastageData);

module.exports = router;
