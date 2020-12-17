const express = require("express");

var register = require('./routes/register');
var login = require('./routes/login');
var blogpage = require('./routes/blogpage');

const app = express();
app.set('view engine', 'pug');
app.set('views','./templates');


app.use('/register',register);
app.use('/login',login);
app.use('/',blogpage);



app.listen(4000);