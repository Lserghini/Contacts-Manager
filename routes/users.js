const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const _=require('lodash');
const config=require('config');
const jwt=require('jsonwebtoken');


// @route   POST api/users
// @desc    register a new user
// @access  PUBLIC
router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','expect a valid email').isEmail(),
    check('password','expect a password with at least 6 characters').isLength({min:6})
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    try{
        let user=await User.findOne({email:req.body.email});
        if(user) return res.status(400).json('user already exists...')

        user=new User(_.pick(req.body,['name','email','password']));

        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(req.body.password,salt);
        user.save();
        const payload={
            user:{
                id:user._id
            }
        }
        jwt.sign(payload,config.get('jwtPrivateKey'),{expiresIn:360000},(err,token)=>{
            if(err) throw err
            res.json({token})
        })
    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed !!');
    }
    
})


module.exports=router;