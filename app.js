// const createError = require('http-errors');
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');

// SESSIONS MODULES
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// ROUTER
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const recipesRouter = require('./routes/recipes');
const apiRouter = require('./routes/api');
const flash = require('connect-flash');

// APP
const app = express();

// SESSION MIDLEWARE
app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'some-string',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());

app.use((req, res, next) => {
    app.locals.currentUser = req.session.currentUser;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BBDD
mongoose.connect(`${process.env.MONGODB_URI}`, {
    keepAlive: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
});

// ROUTER
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/recipes', recipesRouter);
app.use('/api', apiRouter);

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
