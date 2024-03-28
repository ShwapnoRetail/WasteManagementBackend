const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
// constroller functions
const {
    getAltProducts,
    uploadAltProducts,
    getAllMargin,
    uploadMargin
} = require("../controllers/altProductController");

// requireAuth for all routes
router.use(requireAuth);

// get  all products
router.get("/", getAltProducts);

// upload products
router.post("/", uploadAltProducts);

router.get("/margin", getAllMargin);

router.post("/margin", uploadMargin);

module.exports = router;
