const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');

module.exports = function() {
    const app = express();

    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    } else if(process.env.NODE_ENV === 'production'){
        app.use(compress());
    }
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(passport.initialize());

    return app;
};