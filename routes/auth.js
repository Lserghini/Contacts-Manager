const express=require('express');
const router=express.Router();



// @route   POST api/auth
// @desc    auth  a new user & get token 
// @access  PUBLIC
router.post('/',(req,res)=>{
    res.json('log in user');
})

// @route   GET api/auth
// @desc    get logged in user
// @access  PRIVATE
router.get('/',(req,res)=>{
    res.json('get logged in user');
})


module.exports=router;