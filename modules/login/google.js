const Strategy = require('passport-google-oauth20').Strategy;
require('dotenv').config({path:'config/.env'});
module.exports = new Strategy({
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:"/oauth/google",
    passReqToCallback:true
}, async (req, access, refresh, profile, done)=>{
    let user = 
        await req.mongo.user.findOne({id:`${profile.provider}+${profile.id}`});
    if(!user){
        user = new req.mongo.user();
        user.id = `${profile.provider}+${profile.id}`;
        user.pw = `${profile.provider}`;
        user.signupdate = new Date();
        user.role = 'user';
        await user.save();
    }
    done(null, user);
});