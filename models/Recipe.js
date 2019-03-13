'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const recipeSchema = new Schema({
    photoUrl: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    category: {
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
    },
    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }]
});

recipeSchema.index({ title: 'text', ingredients: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
