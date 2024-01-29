const express = require('express');
const router = express.Router();

router.get('/home', (req,res,next)=>{
    res.locals.user = req.user;
    res.render('home');
});
router.get('/login', (req,res,next)=>{
    if(req.user) next(new Error());
    else res.render('login');
});
router.get('/signup', (req,res,next)=>{
    if(req.user) next(new Error());
    else res.render('signup');
});


module.exports = router;