const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const images = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            let now = new Date();
            if(!fs.existsSync(`static/images/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`))
                fs.mkdirSync(`static/images/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`, {recursive:true});
            done(null, `static/images/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
        },
        filename:(req,file,done)=>{
            let name = "";
            let ext = file.originalname.slice(
                file.originalname.lastIndexOf('.'));
            name = 
                btoa(`${file.originalname}+${process.env.COOKIE_SECRET}+${new Date().toJSON()}`).slice(0, 50) + ext;
            console.log(name);
            done(null, name);
        }
    })
});

const videos = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            let now = new Date();
            if(!fs.existsSync(`static/videos/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`))
                fs.mkdirSync(`static/videos/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`, {recursive:true});
            done(null, `static/videos/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
        },
        filename:(req,file,done)=>{
            let name = "";
            let ext = file.originalname.slice(
                file.originalname.lastIndexOf('.'));
            name = 
                btoa(`${file.originalname}+${process.env.COOKIE_SECRET}+${new Date().toJSON()}`).slice(0, 50) + ext;
            done(null, name);
        }
    })
});

router.post('/images/upload',require('../role/user'),
    images.array("images",30),(req,res,next)=>{
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    }, async (req,res,next)=>{
    if(req.body.inner === undefined || 
        req.body.title === undefined) next(new Error());
    else{
        let board = new req.mongo.board();
        board.inner = req.body.inner;
        board.author = req.user.id;
        board.title = req.body.title;
        board.writedate = new Date();
        board.type = req.files.length < 1 ? "none" : "images";
        let mediapath = req.files.map(file=>file.path);
        board.mediapath = mediapath.join(process.env.MEDIAPATH_SPLIT_TOKEN);
        await board.save();
        res.redirect("/boards");
    }
});
router.post('/videos/upload',require('../role/user'),
    videos.single("video"),(req,res,next)=>{
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    },async (req,res,next)=>{
    if(req.body.inner === undefined || 
        req.body.title === undefined) next(new Error());
    else{
        let board = new req.mongo.board();
        board.inner = req.body.inner;
        board.author = req.user.id;
        board.title = req.body.title;
        board.writedate = new Date();
        board.type = req.file != undefined ? "video" : "none";
        board.mediapath = req.file != undefined ? req.file.path : "";
        await board.save();
        res.redirect("/boards");
    }
});

module.exports = router;