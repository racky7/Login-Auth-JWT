const router = require('express').Router()
const verify = require('./verifytoken')
router.get('/', verify, (req,res)=>{
  res.json({info: {
    info1: 'this is private information 1',
    infor2: 'random private info you can not access without token',
    user: req.user
  }})
})

module.exports = router