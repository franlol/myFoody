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
        let likes = user.likes;
        const ownRecipes = user.ownRecipes;
        res.render('user/user', { ownRecipes, likes });
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
    console.log(req.file.url);
});

module.exports = router;
