const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// constroller functions
const { setHour, signupUser, loginUser, bulkSignupUsers, deleteUser ,getUser, getAllUser, logOutMember , logOutAllMembers, selfLogout, stayAlive, setEndHour, updateView} = require('../controllers/userController')

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// set start hour
router.patch('/sethour/:id', setHour)

// set end hour
router.patch('/setendhour/:id', setEndHour)

// delete user
router.post('/delete/:id', deleteUser)

// logout single member
router.patch('/logoutmember/:memberId', logOutMember)

// logout all member
router.patch('/logout-all', logOutAllMembers)

// logout all member
router.post('/logout',requireAuth, selfLogout)

//bulk sign up route
router.post('/bulksignup', bulkSignupUsers)

//update view
router.patch('/updateView/:id', updateView)

// get all users
router.get('/getmembers', getAllUser)

// get all users
router.get('/getuser/:id',requireAuth, getUser)


// stay alive route
router.get('/alive', stayAlive)

module.exports = router