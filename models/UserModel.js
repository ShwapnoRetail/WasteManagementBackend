const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema


const UserSchema = new Schema({
    email_id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    outlet_division: {
        type: String,
        required: true
    },
    outlet_code: {
        type: String,
        required: true
    },
    outlet_name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    is_logged_in: {
        type: Boolean,
        required: true
    },
},{ timestamps:true })

UserSchema.statics.signup = async function( email_id, password,outlet_division,role ,code ,outlet_name ){

        const exists = await this.findOne({ email_id })

        if(exists){
            throw new Error('This user already exists')
        }

        if(!validator.isStrongPassword(password)) {
            throw new Error('Password not strong enough')
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // console.log(hashedPassword)


        
        if(!exists){
            const user = await this.create({ email_id, password: hashedPassword, outlet_division, role , outlet_code:code,outlet_name })
            return user
        } 
        
    }


    // static login method

UserSchema.statics.login = async function(email_id, password) {

    if(email_id && password){
        
        const user = await this.findOne({ email_id })

        if(!user) {
            throw new Error('User does not exist')
        }

        const valid = await bcrypt.compare(password, user.password)

        if(!valid) {
            throw new Error('Incorrect password')
        }

        return user
    }
    if (!email_id && !password) {
            throw new Error('Email and password are required')
    }
    
    if (email_id || !password) {
        throw new Error('Password is required')
    }
    
    if (!email_id || password) {
        throw new Error('Email is required')
    }

}

module.exports = mongoose.model('User', UserSchema)