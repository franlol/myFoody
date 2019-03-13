'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');
const parserUser = require('../middlewares/userUpload');

// MODELS
const User = require('../models/User');
// const Recipe = require('../models/Recipe');

// ROUTES

router.get('/', requireUser, async (req, res, next) => {
    const { _id } = req.session.currentUser;
    try {
        const user = await User.findById(_id)
            .populate('ownRecipes')
            .populate('favRecipes');
        const ownRecipes = user.ownRecipes;
        const favRecipes = user.favRecipes;
        console.log(favRecipes);
        res.render('user/user', { user, ownRecipes, isOwner: true, favRecipes });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;

    let isOwner = false;
    if (id === _id) {
        return res.redirect('/user');
    }
    try {
        const user = await User.findById(id)
            .populate('ownRecipes');
        const ownRecipes = user.ownRecipes;
        const favRecipes = user.favRecipes;
        console.log(favRecipes);
        return res.render('user/user', { user, ownRecipes, isOwner });
    } catch (err) {
        next(err);
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

// UPLOAD USER PROFILE IMG
router.post('/', requireUser, parserUser.single('image'), async (req, res, next) => {
    const { _id } = req.session.currentUser;
    console.log('in upload');
    const user = await User.findById(_id);

    if (!_id || req.file === undefined) {
        console.log('fail');

        return res.redirect('/user');
    }

    user.imageUrl = req.file.url; // img url
    user.save();
    console.log('yes?');
    return res.redirect('/user');
});

module.exports = router;
