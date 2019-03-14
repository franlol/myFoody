'use strict';

// MODULES
const express = require('express');
const router = express.Router();

// MODELS
const Recipe = require('../models/Recipe');

// API
router.get('/search', async (req, res, next) => {
    const { str } = req.query;

    if (!str) {
        const recipes = await Recipe.find().populate('authorId').sort({ date: -1 });
        const response = { 'status': 200, 'recipes': recipes, 'word': str };
        return res.status(200).json(response);
        // return res.status(204).json({ 'status': 204, 'message': '204 No Content' });
    }
    try {
        const recipes = await Recipe.find({ '$text': { '$search': str } }).populate('authorId');
        if (recipes.length === 0) {
            return res.status(204).json({ 'status': 204, 'message': '204 No Content', 'word': str });
        }

        const response = { 'status': 200, 'recipes': recipes, 'word': str };
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }

    // (async () => {
    //     const rawResponse = await fetch('http://localhost:3000/api/search/?str=asd', {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     });
    //     const content = await rawResponse.json();

    //     console.log(content);
    // })();
});
module.exports = router;
