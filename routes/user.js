'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');

// MODELS
// const Recipe = require('../models/Recipe');
const User = require('../models/User');

// ROUTES
router.get('/', requireUser, (req, res, next) => {
    res.render('user/user');
});

router.get('/own', requireUser, async (req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
        const ownRecipes = await User.findById(_id).populate('ownRecipes');
        let isCreator = false;

        res.render('user/own', { ownRecipes, isCreator });
    } catch (error) {
        next(error);
    }
});

router.get('/favs', requireUser, (req, res, next) => {
    res.render('user/favs');
});

module.exports = router;
