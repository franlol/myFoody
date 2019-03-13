$(document).ready(function () {
    // // input tags: <!-- https://www.jqueryscript.net/form/Tagging-Input-Bootstrap-4.html -->
    // $('[data-role="tags-input"]').tagsInput();

    $('[name=tags]').tagify();

    function readURL (input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#form-image').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    // Cuando cambia el fileupload (pq hay foto) le damos tamaño al <img> y ocultamos el <i>cono
    $('#form-image-input').change(function () {
        $('#form-image').width('inherit');
        $('#form-image').height('inherit');
        $('#form-camera').hide();
        console.log(this);
        readURL(this);
    });

    // Al clickar el icono de la camara lanzar el evento click del fileupload
    $('.photo-wrap').click(function () {
        $('#form-image-input').click();
    });

    // Al clicar en un <i>cono, lanzamos el evento click del checkbox, y dependiendo de su estado le cambiamos el color.
    $('.checkbox-wrap input').click(function () {
        $(this).trigger('click');
        if ($(this).prop('checked') === true) {
            $(this).siblings().css('color', '#22264b');
        } else {
            $(this).siblings().css('color', '#d1ccc0');
        }
    });

    // Detectar todos los tags de ingredientes y montar un array con ellos
    $('#form').submit(function () {
        // e.preventDefault();
        var ingredients = [];
        $($('.tags-container').children('.tag')).each(function (element) {
            ingredients.push($(this).find('span').text());
        });
        $('#form-ingredients').val(ingredients);
        // console.log(ingredients);
        return true;
    });

    // Al entrar a una receta, que se muestren las categorias.
    // TO DO

    // Al editar una receta, miramos el array volcado en el input hidden de los checkboxes y si existen los campos los marcamos de azulito
    const categories = document.getElementById('checkbox-edit').value;
    const categoriesArray = categories.split(',');
    if (categoriesArray.includes('meat')) {
        $('#category-meat').prop('checked', true);
        $('#category-meat').siblings().css('color', '#22264b');
    }
    if (categoriesArray.includes('vegetables')) {
        $('#category-vegetables').prop('checked', true);
        $('#category-vegetables').siblings().css('color', '#22264b');
    }
    if (categoriesArray.includes('fish')) {
        $('#category-fish').prop('checked', true);
        $('#category-fish').siblings().css('color', '#22264b');
    }
    if (categoriesArray.includes('backery')) {
        $('#category-backery').prop('checked', true);
        $('#category-backery').siblings().css('color', '#22264b');
    }

    // Al editar una receta, seleccionar la imagen que tiene
    if ($('.photo-wrap img').attr('src')) {
        $('.photo-wrap img').width('100%');
        $('.photo-wrap img').height('100%');

        $('.photo-wrap i').height('0px');
        $('.photo-wrap i').width('0px'); // por alguna razon jquery no lanza este coando (es valido, en consola va.)
        document.querySelector('.photo-wrap i').style.width = '0px'; // por eso lo pongo aqui en js puro

        $('.photo-wrap i').css('padding', '0px');
        $('.photo-wrap i').css('padding', '0px');
    }
});
