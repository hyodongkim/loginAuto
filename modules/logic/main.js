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

router.post('/board/:id', require('../role/user'), async (req,res,next)=>{
    let board = await req.mongo.board.findOne({_id:req.params.id});

    let reply = new req.mongo.reply();
    reply.inner = req.body.reply;
    reply.author = req.user.id;
    reply.writedate = new Date();
    reply.ownreply = req.body.own;
    reply.board = board._id;
    await reply.save();

    res.redirect(`/board/${req.params.id}`);

    // let replys = await req.mongo.reply.find({board:board._id});

    // res.render("board", {
    //     board:board, 
    //     page:req.query.page,
    //     id:req.params.id, 
    //     replys:replys,
    //     splittoken:process.env.MEDIAPATH_SPLIT_TOKEN
    // });
});

router.use(require('./upload'));

module.exports = router;