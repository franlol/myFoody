'use strict';

module.exports = {
    requireForm (req, res, next) {
        // Extraer el body
        const { title, ingredients, cookingTime, description } = req.body;

        // Comprabar que los campos existen
        if (!title || !ingredients || !cookingTime || !description) {
            res.redirect('/recipes/add');

            return;
        }
        next();
    }
};

// ingredients: ingredient1,ingredient2
// photoUrl: dorada.jpg
// category-meat: on
// category-vegetables: on
// category-fish: on
// category-backery: on
// title: title
// cookingTime: 213
// description: description
