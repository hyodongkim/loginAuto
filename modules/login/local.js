const Strategy = require('passport-local').Strategy;
module.exports = new Strategy({
    usernameField:"id",
    passwordField:"pw",
    passReqToCallback:true
}, async (req, id, pw, done)=>{
    try{
        let user = await req.mongo.user.findOne({"id":id, "pw":pw});
        done(null, user || false);
    }
    catch(e){ done(e); }
});