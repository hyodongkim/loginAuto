const express = require('express');
const router = express.Router();

router.get('/home', require('../role/any'), (req, res, next)=>{
    res.render('home');
});

router.get('/login', require('../role/guest'),(req, res, next)=>{
    res.render('login');
});

router.get('/signup', require('../role/guest'),(req,res,next)=>{
    res.render("signup");
});

router.get('/boards', require('../role/any'), async (req,res,next)=>{
    keyword = req.query.keyword ? req.query.keyword : "";
    // a.b.c
    tokens = req.query.tokens ? 
            req.query.tokens.split(".")
            .map(data=>data.trim()) :
            [];
    mediaonly = req.query.mediaonly ? true : false;
    page = req.query.page ? req.query.page : 1;
    let boards = await req.mongo.board.find(
            tokens.length < 1 && keyword === "" ?
            {
                "mediapath":{
                    $not:{ $size: mediaonly ? 0 : 99 }
                }
            } : {
                "mediapath":{
                    $not:{ $size: mediaonly ? 0 : 99 }
                },
                "hashtags":
                {
                    $elemMatch:
                    tokens.length > 0 ? 
                    { $in: [...tokens] } :
                    { $regex: new RegExp(`.*${keyword}.*`, 'i') }
                }
            })
            .sort({_id:-1})
            .skip((page - 1) * parseInt(process.env.PAGE_LIMIT))
            .limit(parseInt(process.env.PAGE_LIMIT));
    let now = new Date();
    now.setHours(now.getHours() - 24);
    let dateformat = date=>{
        if(now.getTime() > 
            date.getTime())
            return `${(date.getMonth() + 1).toString().padStart(2,'0')}`+
            '/'+
            `${date.getDate().toString().padStart(2,'0')}`;
        else
            return `${date.getHours().toString().padStart(2,'0')}`+
            ':'+
            `${date.getMinutes().toString().padStart(2,'0')}`;
    };
    let count = await req.mongo.board.countDocuments(
        tokens.length < 1 && keyword === "" ?
        {
            "mediapath":{
                $not:{ $size:mediaonly ? 0 : 99 }
            }
        } : {
        "mediapath":{
            $not:{ $size:mediaonly ? 0 : 99 }
        },
        "hashtags":
        {
            $elemMatch:
            tokens.length > 0 ? 
            { $in: [...tokens] } :
            { $regex: new RegExp(`.*${keyword}.*`, 'i') }
        }
    });
    let pageCount = Math.ceil(count / parseInt(process.env.PAGE_LIMIT));
    let begin = page - parseInt(process.env.PAGE_PADDING) < 1 ? 
        1 : page - parseInt(process.env.PAGE_PADDING);
    let end = (begin + parseInt(process.env.PAGE_COUNT) - 1) <= pageCount ?
        (begin + parseInt(process.env.PAGE_COUNT) - 1) : pageCount;
    if(end === pageCount){
        begin = (end - parseInt(process.env.PAGE_COUNT) + 1) < 1 ?
            1 : (end - parseInt(process.env.PAGE_COUNT) + 1);
    }
    res.locals = {
        boards:boards,
        page:page,
        begin:begin,
        end:end,
        last:pageCount,
        dateformat:dateformat,
        tokens:tokens,
        keyword:keyword,
        mediaonly:mediaonly
    };
    res.render("boards");
});
router.get('/board/:id', require('../role/any'), async (req,res,next)=>{
    let board = await req.mongo.board.findOne({_id:req.params.id});
    res.render("board", {board:board, page:req.query.page});
});

router.get('/boardwrite', require('../role/user'),(req,res,next)=>{
    res.render("boardwrite");
});

router.get('/boardwriteTest', require('../role/user'), async (req,res,next)=>{
    for(let i = 0; i < 300; i += 1){
        let board = new req.mongo.board();
        board.body = "";
        board.author = req.user.id;
        board.hashtags = [];
        board.writedate = new Date();
        board.type = "none";
        board.mediapath = [];
        await board.save();
    }
    res.redirect("/home");
});

module.exports = router;