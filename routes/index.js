var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.session.currentUser) {
        return res.redirect('/auth/signup');
    }
    res.render('index', { title: 'MyFoody' });
});

module.exports = router;
