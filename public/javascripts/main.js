'use strict';

const main = () => {
    // Al pulsar el boton del user, el cual pertenece a un form, redirigir a profile
    const buttonProfile = document.getElementById('main-button-user');
    buttonProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/user';
    });

    // Search button
    const searchButton = document.querySelector('.main-search-button');

    searchButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputSearch = document.querySelector('#form-input-search').value;

        // fetch
        const searchResult = async () => {
            const request = await fetch(`${window.location.origin}/api/search?str=${inputSearch}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const response = await request;
            if (response.status === 204) {
                return response;
            }
            return response.json();
        };

        const response = await searchResult();
        const cardContainer = document.querySelector('.main-cards');

        if (response.status === 200) {
            cardContainer.innerHTML = '';
            response.recipes.forEach((card) => {
                cardContainer.innerHTML += createCard(card);
            });
            addCardLinks();
        } else {
            cardContainer.innerHTML = '<h4>No results..</h4>';
        }
    });

    // Create card to populate app when user uses searchbars
    function createCard (cardInfo) {
        const card = `<div class="card">
                        <input hidden type="text" value="${cardInfo._id}">
                        <div class="card-img">
                            <img src="${cardInfo.photoUrl}" alt="recipe">
                        </div>
                        <div class="card-info">
                            <h1>${cardInfo.title}</h1>
                            <p class="card-author">${cardInfo.authorId.username}</p>
                        </div>
                        <hr>

                        <div class="card-options">
                            <p><i class="far fa-eye"></i> ${cardInfo.views}</p>
                            <p><i class="fas fa-utensils"></i> ${cardInfo.likes}</p>
                            <p><i class="far fa-comments"></i> ${cardInfo.comments.length}</p>
                        </div>
                    </div>
    `;
        return card;
    }

    // Redirect al clicar en una card a su recipe
    function addCardLinks () {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                const id = card.children[0].value;
                window.location.replace('/recipes/' + id);
            });
        });
    }
    addCardLinks();

    // VOICE HANDLER
    const inputSearch = document.querySelector('#form-input-search');
    const voiceButton = document.querySelector('#search-voice-button');
    const recognition = new webkitSpeechRecognition();

    recognition.maxAlternatives = 3;

    function voiceRecord () {
        recognition.start();
        inputSearch.value = '';
    }

    voiceButton.addEventListener('click', voiceRecord);

    recognition.onresult = (event) => {
        console.log(event);

        if (event.results.length > 0) {
            const result = event.results[0][0].transcript;
            inputSearch.value = result;
        }
    };
    recognition.onend = (event) => {
        if (inputSearch.value.length > 0) {
            searchButton.click();
        } else {
            console.log('no hay nada');
        }
    };
};

window.addEventListener('load', main);

// { /* <i class="fas fa-spinner fa-spin"></i> */ }
