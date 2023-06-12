const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
   return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
    const {staffId, password} = req.body
    
    try { 
        const user = await User.login(staffId, password)
        // create a token
        const token = createToken(user._id)

        const role = user.role.toLowerCase()
        
 
        res.status(200).json({staffId, token, role})
    } catch (err) {
        res.status(400).json({error: err.message})
    } 
}

// signup user
const signupUser = async (req, res) => {

    const {staffId,staffName,password,outletCode,role} = req.body

    try { 
        const user = await User.signup(staffId,staffName,password,outletCode,role)

        // create a token
        const token = createToken(user._id)

        // const role = user.role.toLowerCase()
 
        res.status(200).json({staffId, token, role})
    } catch (err) {
        res.status(400).json({error: err.message})
    }  
 }

 module.exports = {
     loginUser,
     signupUser
 }