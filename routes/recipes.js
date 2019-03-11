'use strict';

// MODULES
const express = require('express');
const router = express.Router();
const parser = require('../middlewares/fileUpload');
const mongoose = require('mongoose');

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
            const adding = await User.findByIdAndUpdate(newRecipe.authorId, { $push: { 'ownRecipes': newRecipe } }, { new: true });
            console.log(adding);
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

// router.get('/:id', requireUser, async (req, res, next) => {
//     const { id } = req.params;
//     const { _id } = req.session.currentUser;
//     try {
//         const recipe = await Recipe.findById(id).populate('authorId');
//         if (recipe) {
//             let isCreator = false;
//             if (recipe.authorId.equals(_id)) {
//                 isCreator = true;
//             }
//             res.render('recipes/recipe', { recipe, isCreator });
//         } else {
//             return res.redirect('/');
//         }
//     } catch (error) {
//         next(error);
//     }
// });

router.get('/:id', requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.session.currentUser;
    try {
        const recipe = await Recipe.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true }).populate('authorId');
        if (recipe) {
            let isCreator = false;
            if (recipe.authorId.equals(_id)) {
                isCreator = true;
            }
            res.render('recipes/recipe', { recipe, isCreator });
        } else {
            return res.redirect('/');
        }
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
    console.log('Adding favourite: ' + id);

    if (id && userId) {
        try {
            const recipe = await Recipe.findById(id);
            if (recipe) {
                const user = await User.findOne({ _id: userId }).lean();
                let exists = user.favRecipes.some((fav) => {
                    return fav.equals(mongoose.Types.ObjectId(id));
                });
                if (!exists) {
                    await User.findByIdAndUpdate({ _id: userId }, { $push: { favRecipes: recipe } }, { new: true });
                    // await user.push(id);
                    return res.status(200).json({ 'message': 'Recipe added to favourites.' });
                } else {
                    await User.findByIdAndUpdate({ _id: userId }, { $pull: { favRecipes: id } }, { new: true });
                    // user.favRecipes.pull({ _id: id });
                    return res.status(200).json({ 'message': 'Recipe removed from favourites.' });
                }
            } else {
                return res.status(404).json({ 'message': '404 No content.' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        return res.status(401).json({ 'message': '401 - No authorized.' });
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
