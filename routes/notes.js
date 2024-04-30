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



// api for deleting a note
router.put('/deletnote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag} = req.body;
    // ab hume yaha pe bs yeh verify krna hai ki jo insaan iss note ko delet kr rha hai woh usi ka hai na 

    let note = await Note.findById(req.params.id);
    // if note not present toh delte kr hi nahi skte 
    if(!note){
        return res.status(404).send("Not Found");
    }
//    if user ne jo id beji hai woh match ni kr rhi so allow ni krenge delete krne ko 
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note has been deleted"});
})



module.exports = router;