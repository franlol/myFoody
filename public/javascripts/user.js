'use strict';

const main = () => {
    // Redirect al clicar en una card a su recipe
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const id = card.children[0].value;
            window.location.replace('/recipes/' + id);
        });
    });
};

window.addEventListener('load', main);
