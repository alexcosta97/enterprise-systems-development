process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('./config/mongoose');
const express = ('./config/express');
const passport = ('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();
app.listen(3000);

module.exports = app;

console.log('Server running at http://localhost:3000/')