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
    res.render('auth/signup');
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
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
        req.session.currentUser = createdUser;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/login', requireAnon, (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const userResult = await User.findOne({ username });
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

router.post('/logout', requireUser, (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('/');
});

module.exports = router;
