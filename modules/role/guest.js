module.exports = (req, res, next)=>{
    if(req.user) next(new Error("아이디 있음"));
    else next();
};