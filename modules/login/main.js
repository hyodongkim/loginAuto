const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

passport.use('local',require('./local'));

passport.serializeUser((req,data,done)=>{
    done(null, data);
});
passport.deserializeUser((req,data,done)=>{
    done(null, data);
});
router.post('/oauth/local', passport.authenticate('local',{
    successRedirect:"/home",
    failureRedirect:"/login"
}));

module.exports = router;