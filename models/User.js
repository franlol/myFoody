'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true
    // },
    favRecipes: {
        type: [String],
        default: []
    },
    ownRecipes: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userModel);

module.exports = User;
