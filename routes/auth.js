const express = require('express');
const User = require('../models/User');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'rishur@1234';

router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min: 5}),
],
    async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // checking if user with same email exists already
    try{
    let user  = await User.findOne({email: req.body.email});
    if(user){
       return res.status(400).json({error: "Sorry !! a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);  // generating salt of 10 characters long 
    const secPass = await bcrypt.hash(req.body.password,salt); // hashing that password with salt 
    console.log(secPass);
     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    })
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    console.log(authtoken);
    res.json({authtoken});
  }catch(error){
    console.log(error.message);
    res.status(500).send("some error occured");
  }
})

module.exports = router;