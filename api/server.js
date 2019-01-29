process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('./config/mongoose');
const express = require('./config/express');
const passport = require('passport');

var db = mongoose();
var app = express();
require('./config/passport')();

const authRoute = require('./routes/auth.routes');
const userRoutes = require('./routes/users.server.routes');
const propertiesRoutes = require('./routes/properties.routes');
const floorsRoutes = require('./routes/floors.routes');
const roomsRoutes = require('./routes/rooms.routes');


app.use('/api/auth/', authRoute);
app.use('/api/users/',userRoutes);
app.use('/api/properties/', propertiesRoutes);
app.use('/api/floors/', floorsRoutes);
app.use('/api/rooms/', roomsRoutes);

app.listen(3000);


module.exports = app;

console.log('Server running at http://localhost:3000/');