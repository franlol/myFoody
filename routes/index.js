const express = require('express');
const router = express.Router();

const { requireUser } = require('../middlewares/auth');

router.get('/', requireUser, (req, res, next) => {
    res.render('index', { title: 'Express' });
});

module.exports = router;
