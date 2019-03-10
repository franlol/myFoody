'use strict';

// MODULES
const express = require('express');
const router = express.Router();
const parser = require('../middlewares/fileUpload');

// MODELS
const Recipe = require('../models/Recipe');

//  MIDDLEWARES
const { requireUser } = require('../middlewares/auth');
// const { requireForm } = require('../middlewares/recipes');

router.get('/add', requireUser, (req, res, next) => {
    res.render('recipes/create-edit');
});

router.post('/add', requireUser, parser.fields([{ name: 'image' }, { name: 'title' }, { name: 'ingredients' }, { name: 'cookingTime' }, { name: 'description' }]), async (req, res, next) => {
    const { title, ingredients, cookingTime, description } = req.body;
    const { categoryMeat, categoryVegetables, categoryFish, categoryBackery } = req.body;

    if (!title || !ingredients || !cookingTime || !description) {
        res.redirect('/recipes/add');
        console.log('FUCK YOU - middleware require-Form');
        return;
    }

    let categories = [];
    if (categoryMeat === 'on') {
        categories.push('meat');
    }
    if (categoryVegetables === 'on') {
        categories.push('vegetables');
    }
    if (categoryFish === 'on') {
        categories.push('fish');
    }
    if (categoryBackery === 'on') {
        categories.push('backery');
    }

    let image = 'https://res.cloudinary.com/jeseh/image/upload/v1552147136/no-dish.png';
    if (req.files.image !== undefined) {
        image = req.files.image[0]['url'];
    }

    const recipe = {
        title,
        photoUrl: image,
        authorId: req.session.currentUser._id,
        category: categories,
        ingredients: ingredients.split(','),
        cookingTime,
        description,
        views: 0,
        likes: 0
    };

    console.log(recipe);

    // ingredients: ingredient1,ingredient2
    // photoUrl: dorada.jpg
    // category-meat: on
    // category-vegetables: on
    // category-fish: on
    // category-backery: on
    // title: title
    // cookingTime: 213
    // description: description

    try {
        // if (_id) {
        //     await Recipe.findByIdAndUpdate(_id, recipe);
        // } else {
        //     recipe.authorId = req.session.currentUser._id;
        //     await Recipe.create(recipe);
        // }

        await Recipe.create(recipe);

        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
