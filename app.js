// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// ROUTER
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// APP
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BBDD
mongoose.connect('mongodb://localhost/myFoody', {
    keepAlive: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
});

// ROUTER
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 4xx handler
app.use((req, res, next) => {
    res.status(404);
    res.render('errors/error400');
});

// 5xx handler
app.use((err, req, res, next) => {
    console.error('ERROR', req.method, req.path, err);
    if (!res.headersSent) {
        res.status(500);
        res.render('errors/error500');
    }
});

module.exports = app;
