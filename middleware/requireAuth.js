const jwt = require('jsonwebtoken');
const User = require('../models/UserModel')

const requireAuth = async (req,res,next) => { 
    
    // verify authentication
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({error: 'Authentication token required'})
    }

    const token = authorization.split(' ')[1]

    try {
       const {_id} = jwt.verify(token, process.env.SECRET)
       req.user = await User.findOne({_id}).select('-password')
    //    console.log("In mid: ",req.user);
       req.outlet = await User.findOne({_id}).select('outlet_division')
       if(!req.user.is_logged_in){
        throw "log out user"
       }
    //    console.log("hello");
       next()
    }
    catch(err){
        console.log(err)
        res.status(401).json({error:'Request is not authorized'})
    }

 }

 module.exports = requireAuth