const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const Contact=require('../models/Contact');
const {check,validationResult}=require('express-validator');
const _=require('lodash');
const mongoose = require('mongoose');



// @route   GET api/contacts
// @desc    get user contacts ie all contacts
// @access  PRIVATE
router.get('/',auth,async(req,res)=>{
    try{
        const contacts=await Contact.find({user:req.user.id}).sort({date:-1});
        res.json(contacts);
    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed...');
    }
})


// @route   POST api/contacts
// @desc    add a new contact
// @access  PRIVATE
router.post('/',[auth,[
    check('name','name is required...').not().isEmpty(),
    check('email','email must be valid...').isEmail(),
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    try{
        const {name,email,phone,type}=req.body;
        let contact=new Contact({
            user:req.user.id,
            name,
            email,
            phone,
            type
        });
        contact.save();
        res.json(contact);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Something Failed...');
    }
})

// @route   PUT api/contacts/:id
// @desc    update a specific contact
// @access  PRIVATE
router.put('/:id',[auth,[
    check('name','name is required...').not().isEmpty(),
    check('email','email must be valid...').isEmail()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({msg:'contact was not found...'});
    try{
        const {name,email,phone,type}=req.body;
        let contactFields={};
        if(name) contactFields.name=name;
        if(email) contactFields.email=email;
        if(phone) contactFields.phone=phone;
        if(type) contactFields.type=type;

        let contact=await Contact.findById(req.params.id);
        if(!contact) return res.status(400).json({msg:'contact was not found...'});

        if(contact.user.toString()!==req.user.id) return res.status(401).json({msg:'unauthorized...'});

        contact=await Contact.findOneAndUpdate({_id:req.params.id},{
        $set:contactFields
    },{new:true})
    res.json(contact);
    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed...');
    }
});


// @route   DELETE api/contacts/:id
// @desc    delete a specific contact
// @access  PRIVATE
router.delete('/:id',auth,async(req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({msg:'contact was not found...'});
        let contact=await Contact.findById(req.params.id);
        if(!contact) return res.status(400).json({msg:'contact was not found...'});

        if(contact.user.toString()!==req.user.id) return res.status(401).json({msg:'unauthorized...'});

        contact=await Contact.findByIdAndRemove(req.params.id);
        res.json(contact);
    }catch(err){
        console.error(err.message);
        res.status(500).send('something failed...');
    }
})


module.exports=router;