const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    "body":{
        "type":String,
        "required":true
    },
    "author":{
        "type":String
    },
    "hashtags":{
        "type":[String]
    },
    "writedate":{
        "type":Date
    },
    "type":{
        "type":String,
        "enum":["images","video","none"]
    },
    "mediapath":{
        "type":[String]
    }
});