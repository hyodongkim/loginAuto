const express = require('express');
const router = express.Router();

router.get('/home', (req,res,next)=>{
    res.locals.user = req.user;
    res.render('home');
});
router.get('/login',require('../role/user'), (req,res,next)=>{
    if(req.user) next(new Error());
    else res.render('login');
});
router.get('/signup',require('../role/guest'), (req,res,next)=>{
    if(req.user) next(new Error());
    else res.render('signup');
});
router.get('/boardwrite',require('../role/user'), (req,res,next)=>{
    
    res.render('boardwrite');
});


module.exports = router;