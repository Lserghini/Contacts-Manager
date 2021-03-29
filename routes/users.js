const express=require('express');
const router=express.Router();



// @route   POST api/users
// @desc    register a new user
// @access  PUBLIC
router.post('/',(req,res)=>{
    res.json('register a new user');
})


module.exports=router;