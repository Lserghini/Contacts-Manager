const express=require('express');
const router=express.Router();



// @route   GET api/contacts
// @desc    get user contacts ie all contacts
// @access  PRIVATE
router.get('/',(req,res)=>{
    res.json('Get All Contacts');
})


// @route   POST api/contacts
// @desc    add a new contact
// @access  PRIVATE
router.post('/',(req,res)=>{
    res.json('add a new contact');
})

// @route   PUT api/contacts/:id
// @desc    update a specific contact
// @access  PRIVATE
router.put('/:id',(req,res)=>{
    res.json('update a specific contact');
})


// @route   DELETE api/contacts/:id
// @desc    delete a specific contact
// @access  PRIVATE
router.delete('/:id',(req,res)=>{
    res.json('delete a specific contact');
})


module.exports=router;