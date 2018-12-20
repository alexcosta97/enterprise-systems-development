process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('./config/mongoose');
const express = require('./config/express');
let passport = require('./config/passport');

var db = mongoose();
var app = express();
app.listen(3000);
passport = passport();


module.exports = app;

console.log('Server running at http://localhost:3000/')