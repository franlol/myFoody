'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');

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

module.exports = router;
