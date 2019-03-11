'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userModel = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://res.cloudinary.com/jeseh/image/upload/v1552329194/user.png'
    },
    // email: {
    //     type: String,
    //     required: true
    // },
    favRecipes: [{
        type: ObjectId,
        ref: 'Recipe'
    }],
    ownRecipes: [{
        type: ObjectId,
        ref: 'Recipe'
    }],
    likes: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userModel);

module.exports = User;
