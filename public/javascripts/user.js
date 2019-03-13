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

    // change profile-photo handler
    const photo = document.querySelector('.profile-photo-wrap img');
    const input = document.querySelector('form input');
    const form = document.querySelector('form');
    const editButton = document.querySelector('.recipe-edit a');

    function readURL (input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                photo.src = e.target.result;
                form.submit();
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    if (editButton) {
        editButton.addEventListener('click', (e) => {
            document.querySelector('form input').click();
        });
    }

    input.addEventListener('change', function (e) { // no fArrow por el this
        readURL(this);
    });

    // recipes Own-Fav switch
    const ownButton = document.querySelectorAll('.profile-nav nav button')[0];
    const favButton = document.querySelectorAll('.profile-nav nav button')[1];
    const ownCards = document.querySelectorAll('.profile-own-recipes .card');
    const favCards = document.querySelectorAll('.profile-fav-recipes .card');
    favCards.forEach((card) => { card.style.display = 'none'; });

    ownButton.addEventListener('click', (e) => {
        ownButton.className = 'profile-pushed';
        favButton.className = '';
        ownCards.forEach((card) => { card.style.display = ''; });
        favCards.forEach((card) => { card.style.display = 'none'; });
    });
    favButton.addEventListener('click', (e) => {
        ownButton.className = '';
        favButton.className = 'profile-pushed';
        favCards.forEach((card) => { card.style.display = ''; });
        ownCards.forEach((card) => { card.style.display = 'none'; });
    });
};

window.addEventListener('load', main);
