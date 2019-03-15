'use strict';
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

const { requireUser } = require('../middlewares/auth');

router.get('/', requireUser, async (req, res, next) => {
    try {
        const orderedRecipes = await Recipe.find().populate('authorId').sort({ date: -1 });
        res.render('index', { orderedRecipes });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
