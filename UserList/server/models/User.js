const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    phone : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    website : String,
    company : {
        name : String,
        catchPhrase : String,
        bs : String,
    },
    address : {
        street : String,
        suite : String,
        city :  String,
        zipCode : String,
        geo : {
            lat : String,
            lng : String
        }
    },
} , {
    timestamps : true
})

// userSchema.pre('save' , async(next) => {
//     if(!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password , 12);
//     next()
// if we write this then no need to write seperate code for hashed password .pre()
//generate hashed password automatically and save it
// })

//compare password

userSchema.methods.comparePassword = async function (candidatePassword)  {
    return await bcrypt.compare(candidatePassword , this.password)
}

module.exports = mongoose.model("User1" , userSchema);