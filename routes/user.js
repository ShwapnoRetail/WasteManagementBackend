const express = require('express');
const router = express.Router();

// constroller functions
const { signupUser, loginUser, bulkSignupUsers } = require('../controllers/userController')

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

//bulk sign up route
router.post('/bulksignup', bulkSignupUsers)

module.exports = router