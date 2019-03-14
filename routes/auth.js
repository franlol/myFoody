'use strict';

// MODULES
const express = require('express');
const router = express.Router();

// ENCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 10;

// MODELS
const User = require('../models/User');

// AUTH MIDDLEWARES
const { requireAnon, requireFields, requireUser } = require('../middlewares/auth');

// ROUTES
router.get('/signup', requireAnon, (req, res, next) => {
    const data = {
        messages: req.flash('validation')
    };
    res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const result = await User.findOne({ username });
        if (result) {
            req.flash('validation', 'This username is taken');
            res.redirect('/auth/signup');
            return;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            // email,
            favRecipes: [],
            ownRecipes: [],
            likes: 0
        };
        const createdUser = await User.create(newUser);
        req.session.currentUser = createdUser;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/login', requireAnon, (req, res, next) => {
    const data = {
        messages: req.flash('validation')
    };
    res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const userResult = await User.findOne({ username });
        if (!userResult) {
            // FLASH
            req.flash('validation', 'Username or password incorrect');
            return res.redirect('/auth/login');
        }
        if (bcrypt.compareSync(password, userResult.password)) {
            // SESSION UP
            req.session.currentUser = userResult;
            return res.redirect('/');
        } else {
            // FLASH
            req.flash('validation', 'Username or password incorrect');
            return res.redirect('/auth/login');
        }
    } catch (err) {
        next(err);
    }
});

router.post('/logout', requireUser, (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('/');
});

module.exports = router;
