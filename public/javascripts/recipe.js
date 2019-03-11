'use strict';

const main = () => {
    // formatear la descripción para reemplazar los \b por <br>
    let description = document.querySelector('.recipe-description p').innerHTML;
    let p = document.querySelector('.recipe-description p');
    let descriptionReplaced = description.replace(/\n/g, '<br>');

    p.innerHTML = descriptionReplaced;

    // Marcar los checkboxes y colorear dependiendo de las categorias
    const categories = document.getElementById('checkbox-info').value;
    const categoriesArray = categories.split(',');
    if (categoriesArray.includes('meat')) {
        document.getElementById('category-meat').checked = true;
        document.getElementById('category-meat').previousSibling.style.color = '#2c3e50';
    }
    if (categoriesArray.includes('vegetables')) {
        document.getElementById('category-vegetables').checked = true;
        document.getElementById('category-vegetables').previousSibling.style.color = '#2c3e50';
    }
    if (categoriesArray.includes('fish')) {
        document.getElementById('category-fish').checked = true;
        document.getElementById('category-fish').previousSibling.style.color = '#2c3e50';
    }
    if (categoriesArray.includes('backery')) {
        document.getElementById('category-backery').checked = true;
        document.getElementById('category-backery').previousSibling.style.color = '#2c3e50';
    }

    // click en favoritos handler
    const addFavLink = document.getElementById('recipe-add-fav');
    addFavLink.addEventListener('click', async () => {
        const addFav = await favHandler(); // addfav devuelve message y fav
        if (addFav.fav === 'true') {
            document.getElementById('recipe-add-fav').style.color = '#22264b';
        } else {
            document.getElementById('recipe-add-fav').style.color = '#d1ccc0';
        }
    });

    const favHandler = async () => {
        const recipeId = document.getElementById('recipe-add-fav').getAttribute('recipe-id');
        // console.log(window.location.hostname);
        const rawResponse = await fetch(`${window.location.origin}/recipes/${recipeId}/addFav`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            // body: JSON.stringify({ id_: 'TEST ID' })
        });
        const content = await rawResponse.json();
        return content;
    };

    // Load page, favoritos handler
    const loadFavs = document.getElementById('recipe-add-fav').getAttribute('fav');
    // console.log(loadFavs);
    if (loadFavs === 'true') {
        document.getElementById('recipe-add-fav').style.color = '#22264b';
    }
};

window.addEventListener('load', main);
