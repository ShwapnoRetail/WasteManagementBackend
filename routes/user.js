const express = require('express');
const router = express.Router();

// constroller functions
const { signupUser, loginUser, bulkSignupUsers , stayAlive} = require('../controllers/userController')

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

//bulk sign up route
router.post('/bulksignup', bulkSignupUsers)


// stay alive route
router.get('/alive', stayAlive)

module.exports = router