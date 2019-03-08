'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const recipeModel = new Schema({
    photoUrl: {
        type: String
    },
    authorId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    classification: {
        type: [String]
    },
    ingredients: {
        type: [String],
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
});

const Recipe = mongoose.model('Recipe', recipeModel);

module.exports = Recipe;
