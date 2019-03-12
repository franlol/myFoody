'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentModel = new Schema({
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Comment = mongoose.model('Comment', commentModel);

module.exports = Comment;
