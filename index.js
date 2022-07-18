 const express = require('express')
 const app = express();
 const dotenv = require('dotenv')
 const PORT = process.env.PORT || 8080
const mongoose = require('mongoose')

dotenv.config()

//ImportRoutes

  const authRoute = require('./routes/auth')
  const privateRoute = require('./routes/privateRoute')

  //Connect to DB

mongoose.connect(process.env['MONGO_URL'], {useNewUrlParser: true}, 

 () =>{
    console.log('Connected to DB')
  })

//Midlleware
app.use(express.json())


//Route Middleware
  app.use('/api/user', authRoute)
  app.use('/api/private', privateRoute)

 app.listen(PORT, () =>{
   console.log('Server Up and running')
 })


