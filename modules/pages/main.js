const express = require("express");
const router = express.Router();

router.get("/home", (req, res, next) => {
  res.locals.user = req.user;
  res.render("home");
});
// router.get('/login',require('../role/user'), (req,res,next)=>{
router.get("/login", require("../role/guest"), (req, res, next) => {
 
 res.render("login");
});
router.get("/signup", require("../role/guest"), (req, res, next) => {
 
 res.render("signup");
});
router.get("/boardwrite", require("../role/user"), (req, res, next) => {
  res.render("boardwrite");
});
router.get("/board/:id", require("../role/any"), (req, res, next) => {
  let board = req.mongo.board.findOne({_id:req.params.id});
  res.render("boards",{board:board});
});
router.get("/boards", require("../role/any"),async (req, res, next) => {
  page = req.query.page ? req.query.page : 1;
  let boards =await req.mongo.board.find({}).sort({_id:-1}).skip((page - 1) * 10).limit(10);
  res.render("boards",{boards:boards});
});

module.exports = router;
