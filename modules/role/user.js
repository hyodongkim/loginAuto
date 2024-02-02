module.exports = (req, res, next)=>{
    if(
        !req.user ||
        req.user.role !== 'user'
    ) next(new Error("아이디 없음"));
    else next();
};