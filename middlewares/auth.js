'use strict';

module.exports = {
    requireAnon (req, res, next) {
        if (req.session.currentUser) {
            res.redirect('/');
            return;
        }
        next();
    },
    // esta middle ware de aqui la usamos para comprobar que existe o hay usuario y contraseña.
    requireFields (req, res, next) {
    // Extraer el body
        const { username, password } = req.body;
        // Comprabar que user name y password existen.
        if (!password || !username) {
            req.flash('validation', 'Username or password missing');
            res.redirect('/auth' + req.path);
            return;
        }
        next();
    }
};
