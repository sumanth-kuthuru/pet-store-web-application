var express = require("express");
var app = express();
var session = require('express-session');
var cookieparser = require('cookie-parser');
var path = require('path');
var controller = require("./routes/Usercontroller");
app.set('view engine','ejs');
app.set("views", path.join(__dirname, "views"));
app.use('/assets',express.static('assets'));
app.use('/partials', express.static('partials'));
app.use(cookieparser());
app.use(session({
    secret: 'Kuthuru',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use('/',controller);
app.listen(8084);
console.log("Started: Listening at 8084");
module.exports = app;
