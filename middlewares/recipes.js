'use strict';

module.exports = {
    requireForm (req, res, next) {
        // Extraer el body
        const { title, ingredients, cookingTime, description } = req.body;
        console.log(title + ' - ' + ingredients + ' - ' + cookingTime + ' - ' + description);
        // Comprabar que los campos existen
        if (!title || !ingredients || !cookingTime || !description) {
            res.redirect('/recipes/add');
            console.log('FUCK YOU - middleware requireForm');
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
