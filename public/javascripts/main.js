'use strict';

const main = () => {
    // navbar white when scroll down
    window.onscroll = function () {
        const nav = document.querySelector('.main-toolbar');
        if (window.scrollY <= 10) nav.className = 'main-toolbar'; else nav.className = 'main-toolbar main-toolbar-scrolled';
    };

    // Al pulsar el boton del user, el cual pertenece a un form, redirigir a profile
    const buttonProfile = document.getElementById('main-button-user');
    buttonProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/user';
    });

    // Search button
    const searchButton = document.querySelector('.main-button');

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
    const voiceButton = document.getElementById('search-voice-button');
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 3;

    function voiceRecord () {
        recognition.start();
        document.getElementById('search-voice-button').style.color = 'red';
        inputSearch.value = '';
    }

    voiceButton.addEventListener('click', voiceRecord);

    recognition.onresult = (event) => {
        console.log(event);
        document.getElementById('search-voice-button').style.color = 'white';
        if (event.results.length > 0) {
            const result = event.results[0][0].transcript;
            inputSearch.value = result;
        }
    };
    recognition.onend = (event) => {
        document.getElementById('search-voice-button').style.color = 'white';
        if (inputSearch.value.length > 0) {
            searchButton.click();
        } else {
            console.log('El micro no ha detectado audio');
        }
    };

    // Hamburger bar
    const mainBurger = document.querySelector('.main-burger');
    const mainBurgerAdd = document.getElementById('main-button-add');
    const mainBurgerHome = document.getElementById('main-button-home');
    const mainBurgerUser = document.getElementById('main-button-user');
    const mainBurgerVoice = document.getElementById('search-voice-button');

    mainBurger.addEventListener('click', function () {
        this.classList.toggle('change');
        mainBurgerAdd.classList.toggle('main-button-add');
        mainBurgerHome.classList.toggle('main-button-home');
        mainBurgerUser.classList.toggle('main-button-user');
        mainBurgerVoice.classList.toggle('search-voice-button');
    });
};

window.addEventListener('load', main);
