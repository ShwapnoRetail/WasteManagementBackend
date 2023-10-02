const express = require('express');
const router = express.Router();

// constroller functions
const { signupUser, loginUser, bulkSignupUsers , getAllUser, logOutMember , logOutAllMembers, stayAlive} = require('../controllers/userController')

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// logout single member
router.patch('/logoutmember/:memberId', logOutMember)

// logout all member
router.patch('/logout-all', logOutAllMembers)

//bulk sign up route
router.post('/bulksignup', bulkSignupUsers)

// get all users
router.get('/getmembers', getAllUser)


// stay alive route
router.get('/alive', stayAlive)

module.exports = router