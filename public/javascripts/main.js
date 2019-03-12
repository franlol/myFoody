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

    // Al pulsar el boton del user, el cual pertenece a un form, redirigir a profile
    const buttonProfile = document.getElementById('main-button-user');
    buttonProfile.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('asd');
        window.location.href = '/user';
    });
};

window.addEventListener('load', main);
