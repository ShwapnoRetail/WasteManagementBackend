const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema


const UserSchema = new Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    staffName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    outletCode: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    user_id: {
        type:String,
        required:true
    }
},{ timestamps:true })

UserSchema.statics.signup = async function( staffId,staffName,  password,outletCode,role ){

        const exists = await this.findOne({ staffId })

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
            const user = await this.create({ staffId,staffName, password: hashedPassword,outletCode,role })
            return user
        } 
        
    }


    // static login method

UserSchema.statics.login = async function(staffId, password) {

    if(staffId && password){
        
        const user = await this.findOne({ staffId })

        if(!user) {
            throw new Error('User does not exist')
        }

        const valid = await bcrypt.compare(password, user.password)

        if(!valid) {
            throw new Error('Incorrect password')
        }

        return user
    }
    if (!staffId && !password) {
            throw new Error('ID and password are required')
    }
    
    if (staffId || !password) {
        throw new Error('Password is required')
    }
    
    if (!staffId || password) {
        throw new Error('ID is required')
    }
    
    

}

module.exports = mongoose.model('User', UserSchema)