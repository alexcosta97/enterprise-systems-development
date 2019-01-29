process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('./config/mongoose');
const express = require('./config/express');
const passport = require('@passport-next/passport');

var db = mongoose();
var app = express();
require('./config/passport')();

const authRoute = require('./routes/auth.routes');
const userRoutes = require('./routes/users.server.routes');

app.use('/api/auth/', authRoute);
app.use('/api/users/',userRoutes);

app.listen(3000);


module.exports = app;

console.log('Server running at http://localhost:3000/');