'use strict';
const express = require('express');
const router = express.Router();

<<<<<<< HEAD
router.get('/', (req, res, next) => {
    if (!req.session.currentUser) {
        return res.redirect('/auth/signup');
    }
    res.render('index', { title: 'MyFoody' });
=======
const { requireUser } = require('../middlewares/auth');

router.get('/', requireUser, (req, res, next) => {
    res.render('index', { title: 'Express' });
>>>>>>> d2648d6ab96e5d9561040a9a981d4f5e7e0f2d9e
});

module.exports = router;
