'use strict';

// MODULES
const express = require('express');
const router = express.Router();

// MODELS
const Recipe = require('../models/Recipe');

//  MIDDLEWARES
const { requireUser } = require('../middlewares/auth');

const { requireForm } = require('../middlewares/recipes');

router.get('/add', requireUser, (req, res, next) => {
    res.render('create-edit');
});

router.post('/add', requireUser, requireForm, async (req, res, next) => {
    const { _id, title, photoUrl, classification, ingredients, cookingTime, description } = req.body;
    const recipe = {
        title,
        photoUrl,
        authorId: req.session.currentUser._id,
        classification,
        ingredients,
        cookingTime,
        description,
        views: 0,
        likes: 0
    };
    try {
        if (_id) {
            await Recipe.findByIdAndUpdate(_id, recipe);
        } else {
            recipe.authorId = req.session.currentUser._id;
            await Recipe.create(recipe);
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
