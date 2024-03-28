const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
// constroller functions
const {
  createAltProductsSub,
  getAltSubs,
  fetchDataByOutletAndDate
} = require("../controllers/altProductSubmissionController");


// requireAuth for all routes
router.use(requireAuth);

// get  all submitted products
router.get("/", getAltSubs);

// upload submitted products
router.post("/", createAltProductsSub);

// get data by date
router.post("/altOutletSub", fetchDataByOutletAndDate);

module.exports = router;