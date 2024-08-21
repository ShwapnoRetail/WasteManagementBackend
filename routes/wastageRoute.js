const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const {
    createDailyWastageData
} = require("../controllers/new_controllers/WastageDailyController");

// requireAuth for all routes
router.use(requireAuth);


// post  all
router.post("/create", createDailyWastageData);

module.exports = router;
