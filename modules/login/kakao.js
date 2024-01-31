const Strategy = require('passport-kakao').Strategy;
require('dotenv').config({path:'config/.env'});
module.exports = new Strategy({
    clientID:process.env.KAKAO_ID,
    clientSecret:process.env.KAKAO_SECRET,
    callbackURL:"/oauth/kakao",
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