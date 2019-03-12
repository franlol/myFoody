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

    // profile photo handler
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

    editButton.addEventListener('click', (e) => {
        document.querySelector('form input').click();
    });

    input.addEventListener('change', function (e) { // no fArrow por el this
        readURL(this);
    });
};

window.addEventListener('load', main);
