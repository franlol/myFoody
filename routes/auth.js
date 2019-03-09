'use strict';

// MODULES
const express = require('express');
const router = express.Router();

// ENCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 10;

// MODELS
const User = require('../models/User');

// ROUTES
router.get('/login', (req, res, next) => {
    // CHECK IF SESSION EXISTS -> /
    if (req.session.currentUser) {
        res.redirect('/');
    }
    res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
    // CHEKC IF SESSION
    if (req.session.currentUser) {
        res.redirect('/');
    }
    const { username, password } = req.body;
    if (!username || !password) {
        res.redirect('/auth/login');
        return;
    }
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

router.get('/signup', (req, res, next) => {
    // CHECK IF SESSION, SO REDIRECT
    if (req.session.currentUser) {
        return res.redirect('/');
    }
    res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
    // CHECKSESSION EXISTS
    if (req.session.currentUser) {
        return res.redirect('/');
    }
    const { username, password } = req.body;
    if (!username || !password) {
        res.redirect('/auth/signup');
        return;
    }
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

module.exports = router;
