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

router.get('/favs', requireUser, (req, res, next) => {
    res.render('user/favs');
});

module.exports = router;
