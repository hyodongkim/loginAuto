const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const images = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            let now = new Date();
            if(!fs.existsSync(`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`))
                fs.mkdirSync(`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`,{recursive:true});
            done(null,`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`);
        },
        filename:(req,file,done)=>{
            let name="";
            let ext = file.originalname.slice(originalname.lastIndexOf('.'));
            for(let i = 0; i<99999999999; i+=1){
            name =
            btoa(`${file.originalname}+${i}+${process.env.COOKIE_SECRET}`+ext);
            if(!fs.existsSync(name)) break;
        }
        done(null,name);
    }   
    })
    
});
const videos = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            let now = new Date();
            if(!fs.existsSync(`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`))
                fs.mkdirSync(`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`,{recursive:true});
            done(null,`static/images/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`);
        },
        filename:(req,file,done)=>{
            let name="";
            for(let i = 0; i<99999999999; i+=1){
                let ext = file.originalname.slice(originalname.lastIndexOf('.'));
            name =
            btoa(`${file.originalname}+${i}+${process.env.COOKIE_SECRET}`+ext);
            if(!fs.existsSync(name)) break;
        }
        done(null,name);
    }
    })
});

router.post('/images/upload',images.array("images",30),(req,res,next)=>{
    res.send("/home");
});
router.post('/videos/upload',videos.single("video"),(req,res,next)=>{
    res.send("/home");
});

module.exports = router;