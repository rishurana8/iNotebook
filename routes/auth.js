const express = require('express');
const User = require('../models/User');
const {body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

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


// Authenticating a user , creating a login page
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
]
,async(req,res)=>{
   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email,password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
         return res.status(400).json({error: "Please try to login with correct credentials"});
      }

      const passwordcompare = await bcrypt.compare(password,user.password);
      if(!passwordcompare){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
      const data = {
         user:{
            id: user.id
         }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      res.json({authtoken});
    }catch(error){
          console.log(error.message);
          res.status(500).send("Internal Server Error");
    }
})

// loggedin user details
router.post('/getuser',fetchuser,async()=>{
try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
}catch(error){
    console.log(error);
    res.status(500).send("Internal Server Error");
}
})


// update note or update wahi note krna hai jiska yeh note ho
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag} = req.body;
    const newNote = {};
    if(title) {newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note = await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found");
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
    res.json({note});
})
module.exports = router;