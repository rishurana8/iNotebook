const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const {body,validationResult} = require('express-validator');

// getting all notes 
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
  try{
      const notes = await Note.find({user: req.user.id});
      res.json(notes);

  }catch(error){
    console.log(error.message);
    res.status(500).send("Internal server error");
  }

})

// add a new note
router.get('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min: 5}),
],async(req,res)=>{
   try{
       const {title,description,tag} = req.body;
       const errors = validationResult(req);
       if(!errors.isEmpty()){
           return res.status(400).json({error: errors.array()});
       }
   
       const note = new Note({
           title,description,tag,user: req.user.id
       })
   
       const savedNote = await note.save();
       return res.json(savedNote);

   }catch(error){
       console.log(error.message);
       res.status(500).send("Internal server error");
   }


})

module.exports = router;