const express = require('express');
const router = express.Router();

router.use((error,req,res,next)=>{
    res.redirect('/home');
});

module.exports= router;