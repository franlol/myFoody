'use strict';
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

const { requireUser } = require('../middlewares/auth');

router.get('/', requireUser, async (req, res, next) => {
    try {
        const recipes = await Recipe.find({});
        console.log(recipes);
        res.render('index', { recipes });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
