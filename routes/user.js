'use strict';

//  MODULES
const express = require('express');
const router = express.Router();
const { requireUser } = require('../middlewares/auth');

// ROUTES
router.get('/', requireUser, (req, res, next) => {
    res.render('user');
});

module.exports = router;
