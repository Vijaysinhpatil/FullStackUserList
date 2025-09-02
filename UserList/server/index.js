const express = require('express')
const app = express();
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 5000

//Import eoutes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

app.use(cors())
app.use(express.json())

//database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log("Not Able Connect the MongoDB" , error);    
})

//Routes
app.use('/api/auth' , authRoutes)
app.use('/api/users' , userRoutes)
//error handling middleware
app.use((err , req , res , next) => {

    if(err)
    {
        console.log("Error is Been Occured" , err); 
                
    }
 
    next()
})
app.listen(PORT , () => {
    console.log(`Server is Connected At PORT => ${PORT}`);
})