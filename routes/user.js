'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');
const parserUser = require('../middlewares/userUpload');

// MODELS
const User = require('../models/User');

// ROUTES

router.get('/', requireUser, async (req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
        const user = await User.findById(_id).populate('ownRecipes');
        const ownRecipes = user.ownRecipes;
        res.render('user/user', { user, ownRecipes });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;
    try {
        
        res.render('user/user');
    } catch (error) {
        next(error);
    }
});

router.get('/favs', requireUser, async (req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
        const user = await User.findById(_id).populate('favRecipes');
        const favRecipes = user.favRecipes;
        res.render('user/favs', { favRecipes });
    } catch (error) {
        next(error);
    }
});

router.post('/', requireUser, parserUser.single('image'), async (req, res, next) => {
    res.redirect('/user');
});

module.exports = router;
