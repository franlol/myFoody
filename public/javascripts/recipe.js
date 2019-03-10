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
};

window.addEventListener('load', main);
