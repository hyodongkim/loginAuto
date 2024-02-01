const express = require('express');
const router = express.Router();

router.post('/signup', async (req,res,next)=>{
    if(
        req.body.id === undefined || 
        req.body.pw === undefined ||
        req.user
    ) next(new Error());
    else{
        let user = await req.mongo.user.findOne({id:req.body.id, pw:req.body.pw});
        if(user) res.redirect("/signup");
        else {
            user = new req.mongo.user();
            user.id = req.body.id;
            user.pw = req.body.pw;
            user.signupdate = new Date();
            user.role = "user";
            await user.save();
            res.redirect("/login");
        }
    }
});
router.post('/logout', async (req,res,next)=>{
    req.logout(()=>{});
    req.session.destroy();
    res.redirect("/home");
});

router.use(require('./upload'));

module.exports = router;