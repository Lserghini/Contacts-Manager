const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const _=require('lodash');
const config=require('config');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');

// @route   POST api/auth
// @desc    auth  a new user & get token 
// @access  PUBLIC
router.post('/',[
    check('email','email must be valid...').isEmail(),
    check('password','password must be valid...').exists()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({erros:errors.array()});

    try{
        const {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user) return res.status(400).json({msg:'invalid credentials...'});

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:'invalid credentials...'});
        
        const payload={
            user:{
                id:user._id
            }
        }

        jwt.sign(payload,config.get('jwtPrivateKey'),{expiresIn:360000},(err,token)=>{
            if(err) throw err;
            res.json({token});
        })

    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed...');
    }
    
})

// @route   GET api/auth
// @desc    get logged in user
// @access  PRIVATE
router.get('/',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed');
    }
})


module.exports=router;