'use strict';

// MODULES
const express = require('express');
const router = express.Router();
const parser = require('../middlewares/fileUpload');
const mongoose = require('mongoose');
const moment = require('moment');

// MODELS
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');

//  MIDDLEWARES
const { requireUser } = require('../middlewares/auth');
// const { requireForm } = require('../middlewares/recipes');

router.get('/add', requireUser, (req, res, next) => {
    const data = {
        messages: req.flash('validation')
    };
    res.render('recipes/create-edit', data);
});

router.post('/add', requireUser, parser.fields([{ name: 'image' }, { name: 'title' }, { name: 'ingredients' }, { name: 'cookingTime' }, { name: 'description' }]), async (req, res, next) => {
    const { _id, title, ingredients, cookingTime, description } = req.body;
    const { categoryMeat, categoryVegetables, categoryFish, categoryBackery } = req.body;
    let { image } = req.body;

    if (!title || !ingredients || !cookingTime || !description) {
        req.flash('validation', 'There is an empty field');
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
        image = 'https://res.cloudinary.com/jeseh/image/upload/v1552657450/plato.jpg';
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
        description

    };
    try {
        if (_id) {
            const updatedRecipe = await Recipe.findByIdAndUpdate(_id, recipe, { new: true });

            res.redirect('/recipes/' + updatedRecipe._id);
        } else {
            const newRecipe = await Recipe.create(recipe);
            const adding = await User.findByIdAndUpdate(newRecipe.authorId, { $push: { 'ownRecipes': newRecipe } }, { new: true });
            console.log(adding);
            res.redirect('/recipes/' + newRecipe._id);
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:id', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;
    try {
        const recipe = await Recipe.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })
            .populate('authorId')
            .populate({
                path: 'comments',
                populate: {
                    path: 'authorId',
                    model: 'User'
                }
            });

        if (recipe) {
            let isCreator = false;
            if (recipe.authorId.equals(_id)) {
                isCreator = true;
            }
            const user = await User.findById(_id);
            const isFav = user.favRecipes.some((recipe) => {
                return recipe._id.equals(mongoose.Types.ObjectId(id));
            });

            res.render('recipes/recipe', { recipe, isCreator, isFav });
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        res.redirect(`/recipes/${id}`);
        console.log('FUCK YOU - comment without content');
        return;
    }
    const date = moment().format('YYYY-MM-DD');
    const recipeComment = {
        content,
        authorId: req.session.currentUser._id,
        date
    };
    try {
        const newRecipeComment = await Comment.create(recipeComment);
        await Recipe.findByIdAndUpdate(id, { $push: { 'comments': newRecipeComment._id } }, { new: true });
        res.redirect(`/recipes/${id}`);
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

// API
router.put('/:id/addFav', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.session.currentUser._id;

    if (!id || !userId) {
        return res.status(401).json({ 'message': '401 - No authorized.', 'fav': 'false' });
    }
    try {
        const recipe = await Recipe.findById(id).populate('authorId');
        if (!recipe) {
            return res.status(404).json({ 'message': '404 Not found', 'fav': 'false' });
        }
        const user = await User.findOne({ _id: userId }).lean();

        let isInFavorites = user.favRecipes.some((fav) => {
            return fav.equals(mongoose.Types.ObjectId(id));
        });

        let updateFavorites;
        let updateLikes;
        let response;

        if (!isInFavorites) {
            updateFavorites = { $push: { favRecipes: id } };
            updateLikes = { $inc: { likes: +1 } };
            response = { 'message': 'Recipe added to favourites.', 'fav': 'true' };
        } else {
            updateFavorites = { $pull: { favRecipes: id } };
            updateLikes = { $inc: { likes: -1 } };
            response = { 'message': 'Recipe removed from favourites.', 'fav': 'false' };
        }

        await User.findByIdAndUpdate(userId, updateFavorites);
        await User.findByIdAndUpdate(recipe.authorId._id, updateLikes);

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateLikes, { new: true });

        response.favTotal = updatedRecipe.likes;
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }

    // (async () => {
    //     const rawResponse = await fetch('http://localhost:3000/recipes/5c85560fb8bc1079662e85a5/addFav', {
    //       method: 'PUT',
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       },

    //   body: JSON.stringify({id: "TEST ID"})
    //     });
    //     const content = await rawResponse.json();

    //     console.log(content);
    //   })();
});
module.exports = router;
