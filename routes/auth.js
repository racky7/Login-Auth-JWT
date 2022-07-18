const router = require('express').Router()
const User = require('../model/user')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

//LOGIN
router.post('/login', async (req,res)=>{
  // Validate before creating user
  const {error} = loginValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  
  // check for email does not exist
  const user = await User.findOne({email: req.body.email})
  if(!user) return res.status(400).send('Wrong email or No Account exist!')

  // Check if password is correct

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).send('Invalid password')

  //Create and assign a  token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token);
  

})


module.exports = router