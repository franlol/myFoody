$(document).ready(function () {
    // input tags: <!-- https://www.jqueryscript.net/form/Tagging-Input-Bootstrap-4.html -->
    $('[data-role="tags-input"]').tagsInput();
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
        readURL(this);
    });

    // Al clickar el icono de la camara lanzar el evento click del fileupload
    $('#form-camera').click(function () {
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
});
