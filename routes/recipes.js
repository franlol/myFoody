'use strict';

// MODULES
const express = require('express');
const router = express.Router();
const parser = require('../middlewares/fileUpload');

// MODELS
const Recipe = require('../models/Recipe');
const User = require('../models/User');

//  MIDDLEWARES
const { requireUser } = require('../middlewares/auth');
// const { requireForm } = require('../middlewares/recipes');

router.get('/add', requireUser, (req, res, next) => {
    res.render('recipes/create-edit');
});

router.post('/add', requireUser, parser.fields([{ name: 'image' }, { name: 'title' }, { name: 'ingredients' }, { name: 'cookingTime' }, { name: 'description' }]), async (req, res, next) => {
    const { _id, title, ingredients, cookingTime, description } = req.body;
    const { categoryMeat, categoryVegetables, categoryFish, categoryBackery } = req.body;
    let { image } = req.body;

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

    if (!image) {
        image = 'https://res.cloudinary.com/jeseh/image/upload/v1552147136/no-dish.png';
    }
    if (req.files.image !== undefined) {
        image = req.files.image[0]['url'];
    }

    console.log(image);
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
    try {
        if (_id) {
            console.log('HAY ID, EXISTIA');
            await Recipe.findByIdAndUpdate(_id, recipe);
        } else {
            console.log('no hay id, NO EXISTIA');
            const newRecipe = await Recipe.create(recipe);
            await User.findByIdAndUpdate(newRecipe.authorId, { $push: { 'ownRecipes': newRecipe._id.toString() } });
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

router.get('/:id', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;
    try {
        const recipe = await Recipe.findById(id).populate('authorId');

        let isCreator = false;
        if (recipe.authorId.equals(_id)) {
            isCreator = true;
        }
        res.render('recipes/recipe', { recipe, isCreator });
    } catch (error) {
        next(error);
    }
});

router.get('/:id/edit', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe.authorId.equals(_id)) {
            res.redirect('/');
            return;
        }
        res.render('recipes/create-edit', recipe);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/delete', requireUser, async (req, res, next) => {
    const { id } = req.params;

    const { _id } = req.session.currentUser;
    try {
        const recipe = await Recipe.findById(id);
        if (recipe.authorId.equals(_id)) {
            await Recipe.findByIdAndDelete(id);
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
