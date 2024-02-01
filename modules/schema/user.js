const mongoose = require('mongoose');
module.exports = mongoose.Schema({
    "id":{
        "type":String,
        "required":true,
        "unique":true
    },
    "pw":{
        "type":String,
        "required":true,
        "match":/^.{4,12}$/
    },
    "signupdate":{
        "type":Date
    },
    "role":{
        "type":String,
        "enum":["user","admin"]
    }
});