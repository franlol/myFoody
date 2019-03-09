'use strict';

module.exports = {
    // esta middle ware de aqui la usamos para comprobar que existe o hay usuario y contraseña.
    requireForm (req, res, next) {
        // Extraer el body
        const { title, classification, ingredients, cookingTime, description } = req.body;
        // Comprabar que los campos existen
        if (!title || !classification || !ingredients || !cookingTime || !description) {
            res.redirect('/recipes/add');
            return;
        }
        next();
    }
};
