const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/' , auth , async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
})

// get the perticular user by Id
router.get('/:id' , auth , async(req , res) => {
    try{
        const user = await User.findById(req.params.id).select('-password')
        if(!user)
        {
            return res.status(404).json({
                message : "User Not Found",
            })
        }
        res.json(user)
    }catch(err)
    {
        res.status(500).json({
            message : "Server Error",
            Error : err.message
        })
    }
})

// Update the user

router.put("/:id" , auth , async(req , res) => {
    try{
        const {name , email , phone} = req.body;

        //checking if the user is updating their own profile or is admin
        if(req.user._id.toString() !== req.params.id)
        {
            return res.status(403).json({
                message : "Access denied"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {name , email , phone},
            {new : true , runValidators:true}
        ).select('-password')

        if(!user)
        {
            return res.status(404).json({
                message : "User not Found",
            })
        }
        res.json(user)
    }catch(err){
        res.status(500).json({
            message : "Server Error",
            Error : err.message
        })
    }
})

// Delete User
router.delete('/:id' , auth , async(req , res) => {
    try{
        // Checking if the user is deleting their own profile or admin

        if(req.user._id.toString() !== req.params.id)
        {
            return res.status(403).json({
                message : "Access Denaied",
            })
        }
        const user = await User.findByIdAndDelete(req.params.id)
        
        if(!user)
        {
            return res.status(404).json({
                message : "User Not Found"
            })
        }
        res.json({
            message : "User deleted successfully"
        })
    } catch(error){
        res.status(500).json({
            message : 'Server Error',
            Error : error.message
        })
    }
})
module.exports = router
