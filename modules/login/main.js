const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

passport.use('local', require('./local'));
passport.use('naver', require('./naver'));
passport.use('kakao', require('./kakao'));
passport.use('google', require('./google'));

passport.serializeUser((req, data, done)=>{
    done(null, data);
});
passport.deserializeUser((req, data, done)=>{
    done(null, data);
});

router.post('/oauth/local', passport.authenticate('local',{
    successRedirect:"/home",
    failureRedirect:"/login"
}));

router.get('/oauth/naver', passport.authenticate('naver',{
    successRedirect:"/home",
    failureRedirect:"/login"
}));
router.get('/oauth/kakao', passport.authenticate('kakao',{
    successRedirect:"/home",
    failureRedirect:"/login"
}));
router.get('/oauth/google', passport.authenticate('google',{
    successRedirect:"/home",
    failureRedirect:"/login",
    scope:['profile','email']
}));

module.exports = router;