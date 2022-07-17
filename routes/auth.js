const router = require('express').Router()
const User = require('../model/user')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')

router.post('/register', async (req,res)=>{
  // Validate before creating user
  const {error} = registerValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  // check for alredy exist user
  const emailExist = await User.findOne({email: req.body.email})
  if(emailExist) return res.status(400).send('Email already exist')

  //Hash the password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  
  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try{
    const savedUser = await user.save()
    res.send({user: user._id})
  }catch(err){ 
    res.status(400).send(err)
  }
  
})

router.post('/login', (req,res)=>{
  
})


module.exports = router