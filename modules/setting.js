const express = require('express');
const router = express.Router();
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis').default;
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const models = require('./schema');
const login = require('./login/main');
const realModels = {};
dotenv.config({path:'config/.env'});
const redisClient = redis.createClient({url:process.env.REDIS_URI});
mongoose.connect(process.env.MONGO_URI, {
    autoIndex:true,
    maxPoolSize:100,
    minPoolSize:30
});
redisClient.connect();
for(let key in models) realModels[key] = mongoose.model(key, models[key]);
router.use(express.json());
router.use(express.raw());
router.use(express.text());
router.use(express.urlencoded({extended:true}));
router.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:true,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:parseInt(process.env.MAX_AGE),
        httpOnly:true,
        secure:false
    },
    store: new connectRedis({
        prefix:"ssid:",
        ttl:parseInt(process.env.MAX_AGE),
        scanCount:100,
        client:redisClient
    })
}));
router.use(cors({
    origin:`https://localhost:${process.env.PORT}`,
    methods:['get','post'],
    allowedHeaders:['Content-Type'],
    exposedHeaders:['Content-Type'],
    maxAge:parseInt(process.env.MAX_AGE)
}));
router.use('/static', express.static('static', {
    dotfiles:'ignore',
    extensions:[],
    fallthrough:true,
    immutable:false,
    maxAge:parseInt(process.env.MAX_AGE),
    index:false,
    redirect:false
}));
router.use((req,res,next)=>{
    req.mongo = realModels;
    next();
});
router.use(login);

module.exports = router;