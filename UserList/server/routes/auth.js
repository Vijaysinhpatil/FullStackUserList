const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
// const { use } = require('react')
const bcrypt = require('bcryptjs')
const router = express.Router()

//Register

router.post('/register' , async(req , res) => {
    try{

        const {name , email , password , phone} = req.body;

        //Check is if the user user is existing

        const existingUser = await User.findOne({email})

        if(existingUser)
        {
            return res.status(401).json({
                error : "User is Already Exists"
            })
        }
    
        const hashedPassword = await bcrypt.hash(password , 10)

        //Create and saving the user

        const user = new User({
            name : name,
            email : email,
            phone : phone,
            password : hashedPassword
        })
        await user.save()

        //Generate JWT payload
        const token = jwt.sign(
            {
                id : user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn : '7d'
            }
        )

        res.status(201).json({

            message : "User Created Successfully",
            token,
            user : {
               id : user._id,
               name : user.name,
               phone : user.phone,
                email: user.email,
        
            }
        });
    }
    catch(error){
        return res.status(401).json({
            message : "Server Error",
            error : error.message
        })
    }
})

// User Login

router.post('/login' , async(req , res) => {

    try
    {
        const {email , password} = req.body;
        
        // finding the user
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({
                error : "Invalid Credentials"
            })
        }

        //Check password
        const isMatch = await user.comparePassword(password)
        if(!isMatch)
        {
            return res.status(400).json({
                error : "Invalid Credentials"
            })
        }

        //Generate Tokens
        const token = jwt.sign({
            id : user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn : "7d"
        }
    );

    res.json({

        success : "Login SuccessFully",
        token,
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
            phone : user.phone
        }
    })
    } catch(error)
    {
         res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
})

//Get the Current User

router.get('/me' , auth , async(req , res) => {
    res.json({
        user : {
            id : req.user._id ,
            name : req.user.name,
            email : req.user.email,
            phone : req.user.phone
        }
    })
})
module.exports = router


// | Term                     | Description                           |
// | ------------------------ | ------------------------------------- |
// | `req.body`               | Data sent by client (email, password) |
// | `User.findOne()`         | Finds user in DB by email             |
// | `comparePassword`        | Method in schema using bcrypt         |
// | `jwt.sign()`             | Signs a JWT token                     |
// | `process.env.JWT_SECRET` | Secret key stored in .env file        |
// | `res.json()`             | Sends JSON response to client         |
