// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 400 handler
app.use((req, res, next) => {
    res.status(404);
    res.render('errors/error400');
});

// 500 handler
app.use((err, req, res, next) => {
    console.error('ERROR', req.method, req.path, err);
    if (!res.headersSent) {
        res.status(500);
        res.render('errors/error500');
    }
});

module.exports = app;
