const mongoose = require('mongoose');

const NotesSchema = new Schema({
     title:{
        type: String,
        required: true
     },
     title: {
        type: String,
        required: true
     },
     tag: {
       type: String,
       default: "General"
     },
     date: {
        type: Date,
        default: Date.now
     }
});

module.exports = mongoose.model('',NotesSchema);