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
const { requireAnon } = require('../middlewares/auth');
const { requireFields } = require('../middlewares/auth');

// ROUTES
router.get('/signup', requireAnon, (req, res, next) => {
    // CHECK IF SESSION, SO REDIRECT
    res.render('auth/signup');
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
    // CHECKSESSION EXISTS
    const { username, password } = req.body;
    try {
        const result = await User.findOne({ username });
        if (result) {
            console.log('User :' + username + ' already exists. Please choose other one');

            return res.redirect('/auth/signup');
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
        // ADD SESSION
        req.session.currentUser = createdUser;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/login', requireAnon, (req, res, next) => {
    // CHECK IF SESSION EXISTS -> /
    res.render('auth/login');
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
    // CHEKC IF SESSION
    const { username, password } = req.body;
    try {
        const userResult = await User.findOne({ username });
        console.log(userResult);
        if (!userResult) {
            // FLASH
            return res.redirect('/auth/login');
        }
        if (bcrypt.compareSync(password, userResult.password)) {
            // SESSION UP
            req.session.currentUser = userResult;
            return res.redirect('/');
        } else {
            // FLASH
            return res.redirect('/auth/login');
        }
    } catch (err) {
        next(err);
    }
    // SESSION UP
});

module.exports = router;
