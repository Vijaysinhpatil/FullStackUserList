const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req , res , next) => {

    try {

        const token = req.header('Authorization')?.replace('Bearer ', '').trim()

        if(!token)
        {
            return res.status(401).json({
                error : "Token is Not Found"
            })
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select('-password')

        if(!user)
        {
            return res.status(401).json({
                error : "Token is not validate"
            })
        }
        req.user = user

        next()
    }
    catch(error)
    {
        console.log("Error is Been Occured" , error);
        return res.status(401).json({
            error : "Token is not validate"
        })
    }
}
module.exports = auth