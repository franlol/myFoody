'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');

// MODELS
// const Recipe = require('../models/Recipe');

// ROUTES
router.get('/', requireUser, (req, res, next) => {
    res.render('user/user');
});

router.get('/own', requireUser, (req, res, next) => {
    res.render('user/own');
});

// ROUTE TO FAVORITES -- AQUÍ TENGO UN POCO DE LIO, LA VERDAD
// router.get('/:id', requireUser, async (req, res, next) => {
//     const { id } = req.params;
//     const { _id } = req.session.currentUser;
//     try {
//         // le hemos añadido populate y es una especia de findbyId dentro del findbyId qe nos devolvera las propiedades que hayamos requerido dentro del populate
//         // lo usamos para no tener que hacer mas referencias y ahorrar código.
//         const recipe = await Recipe.findById(id).populate('authorId');
//         let isCreator = false;
//         if (recipe.authorId.equals(_id)) {
//             isCreator = true;
//         }
//         res.render('user', { recipe, isCreator });
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = router;
