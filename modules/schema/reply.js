const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    "inner":{
        "type":String,
    },
    "author":{
        "type":String
    },
    "writedate":{
        "type":Date
    },
    "ownreply":{
        "type":mongoose.Schema.ObjectId
    },
    "board":{
        "type":mongoose.Schema.ObjectId
    }
});