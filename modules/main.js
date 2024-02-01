const express = require('express');
const app = express({xPoweredBy:false});
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(require('./setting'));

app.use(require('./mw'));
app.use(require('./logic/main'));
app.use(require('./pages/main'));

app.use((err,req,res,next)=>{ res.redirect("/home"); });
app.listen(process.env.PORT);