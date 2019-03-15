'use strict';
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

const { requireUser } = require('../middlewares/auth');

router.get('/', requireUser, async (req, res, next) => {
    try {
        const recipes = await Recipe.find().populate('authorId').sort({ date: -1 });
        const orderedRecipes = recipes.sort((a, b) => {
            return b.date - a.date;
        });
        console.log(orderedRecipes);
        res.render('index', { orderedRecipes });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
