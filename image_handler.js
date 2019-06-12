/********************* IMAGE HANDLERS *********************/

document.getElementById('add-image').addEventListener('click', (e) => {
    openPopupWindow(e.target)
});

document.getElementById('add-album').addEventListener('click', (e) => {
    openPopupWindow(e.target)
});

document.getElementById('add-banner').addEventListener('click', (e) => {
    openPopupWindow(e.target);
});

function previewFile(input, image) {
    var preview = image;
    var file = input.files[0];
    var reader = new FileReader();
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
        reader.addEventListener("load", function () {
            preview.src = reader.result;

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    } else {
        preview.src = null;
        return 0;
    }
    return 1;
};

function previewFiles(album_preview, input, message) {
    let preview = album_preview;
    let files = input.files;
    let result = 1;
    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();
            if (preview.children.length <= 3) {
                reader.addEventListener("load", function () {
                    var image = new Image();
                    image.height = 100;
                    image.title = file.name;
                    image.src = this.result;
                    preview.appendChild(image);
                }, false);

                reader.readAsDataURL(file);
            } else {
                message.style.display = 'block';
            }

        } else {
            result = 0;
        }
    }
    if (files) {
        //[].forEach.call(files, readAndPreview);
        for (let x of files) readAndPreview(x);
    }
    return result;
};


function cancelAddImage(input, img, div) {
    input.value = '';
    img.src = '';
    image_src = false;
    div.parentNode.remove();
}

function cancelAddAlbum(input, div) {
    input.value = '';
    div.parentNode.remove();
}

function createTitleForPopUpWindow(str) {
    let message = str === 'image' ? 'Please select an image' :
        'Please select 4 images';
    let p = fastCreateNode('p', message);
    p.style.color = '#c586c0';
    return p;
}

// TODO
function addImage(input, img, div, banner=false) {
    let figure = document.createElement('figure');
    let figcaption = fastCreateNode('figcaption', 'Caption place');
    let img_ = document.createElement('img');
    img_.src = img.src;
    figcaption.setAttribute('contenteditable', 'true');
    figcaption.addEventListener('mouseup', (e) => {
        handleSelection(e);
    });
    figure.setAttribute('class', 'image-wrapper');
    if (banner) figure.setAttribute('class', 'banner');
    figure.appendChild(img_);
    figure.appendChild(figcaption);

    checkLength(figcaption, 70);

    if (!banner) article.appendChild(figure);
    else insertBefore(document.getElementsByTagName('h2')[0], figure)
    insertBefore(figure, createRemovable({}, 'class'));
    cancelAddImage(input, img, div);
}


function imageHandler(div, banner=false) {
    let wrapper = document.createElement('div');
    let title = createTitleForPopUpWindow('image');
    let input_img = document.createElement('input');
    let img_wrapper = document.createElement('div');
    let img = document.createElement('img');
    let button_wrapper = document.createElement('div');
    let add = fastCreateNode('button', 'add');
    let cancel = fastCreateNode('button', 'cancel');
    let invalid = errorMessage('Invalid file format');

    setAttributes(input_img, { 'type': 'file' });
    setAttributes(img, { 'src': '', 'id': 'preview-image' });

    input_img.addEventListener('change', () => {
        let result = previewFile(input_img, img);
        result ? invalid.style.display = 'none' : invalid.style.display = 'block';
    });

    setAttributes(add, { 'type': 'button', 'class': 'btn' });
    setAttributes(cancel, { 'type': 'button', 'class': 'btn' });

    cancel.addEventListener('click', () => {
        cancelAddImage(input_img, img, div);
    });

    add.addEventListener('click', () => {
        let file = input_img.files[0];
        if (file && (/\.(jpe?g|png|gif)$/i.test(file.name))) {
            addImage(input_img, img, div, banner);
        }
    });


    button_wrapper.appendChild(add);
    button_wrapper.appendChild(cancel);
    button_wrapper.style.display = 'flex';
    button_wrapper.style.justifyContent = 'space-evenly';

    img_wrapper.appendChild(img);

    for (x of [title, input_img, img_wrapper, invalid, button_wrapper]) {
        wrapper.appendChild(x);
    }

    return wrapper;
}


function addAlbum(div_wrapper, input, div) {
    // let children = div_wrapper.children;
    let imgs = div_wrapper.children;
    let figures = [];
    // for (let img of children) imgs.push(img.cloneNode(true));
    let album_wrapper = document.createElement('div');
    album_wrapper.setAttribute('class', 'album-wrapper');


    for (let img of imgs) {
        //removeAttrs(img, ['title']);

        let figure = document.createElement('figure');
        let figcaption = fastCreateNode('figcaption', 'Caption place');
        let img_ = document.createElement('img');
        img_.src = img.src;
        figcaption.setAttribute('contenteditable', 'true');
        figcaption.addEventListener('mouseup', (e) => {
            handleSelection(e);
        });
        checkLength(figcaption, 70);
        figure.appendChild(img_);
        figure.appendChild(figcaption);
        figure.addEventListener('click', function () {
            insertFiguresToModal(figures, this);
        });
        figures.push(figure);
        album_wrapper.appendChild(figure);
    }


    article.appendChild(album_wrapper);
    insertBefore(album_wrapper, createRemovable({}, 'class'));

    cancelAddAlbum(input, div);
}


function bindFigcaptions(from_, to_) {
    let to_fig = to_.getElementsByTagName('figcaption')[0];
    let from_fig = from_.getElementsByTagName('figcaption')[0];
    let t, k;
    from_fig.addEventListener('mouseup', (e) => {
        handleSelection(e);
    });
    checkLength(from_fig, 70);
    from_fig.addEventListener('input', (e) => {
        to_fig.innerHTML = e.target.innerHTML;
    });

    from_fig.addEventListener('focus', () => {
        clearTimeout(t);
        clearTimeout(k);
    });

    from_fig.addEventListener('blur', (e) => {
        t = setTimeout(() => {
            to_fig.innerHTML = e.target.innerHTML;
        }, 10000);
        k = setTimeout(() => {
            if (document.getElementById('link-window')) {
                document.getElementById('link-window').remove();
            }
            if (document.getElementById('link-italic-bold')) {
                document.getElementById('link-italic-bold').remove();
            }
        }, 8000);
    });
}



function setImage(index, preview) {
    for (let i = 0; i < preview.children.length; i++) {
        if (index !== i) preview.children[i].style.display = 'none';
    }
    preview.children[index].style.display = 'block';
}

function insertFiguresToModal(figures, target) {

    let modal_wrapper = document.getElementById('modal-content-wrapper');
    let image_preview = document.createElement('div');
    let image_list = document.createElement('div');
    let target_index = 0;
    image_preview.setAttribute('id', 'image-preview');
    image_list.setAttribute('id', 'image-list');
    modal_wrapper.appendChild(image_list);
    modal_wrapper.appendChild(image_preview);

    //image_preview.appendChild(target.cloneNode(true));
    for (let i = 0; i < figures.length; i++) {
        let figure = figures[i];
        let copy_figure = figure.cloneNode(true);
        let preview_copy = copy_figure.cloneNode(true)
        // bind figcaptions!!! required
        bindFigcaptions(preview_copy, figure);
        bindFigcaptions(preview_copy, copy_figure);
        copy_figure.addEventListener('click', function (e) {
            setImage(i, image_preview);
        });

        if (target === figure) target_index = i;
        image_list.appendChild(copy_figure);
        image_preview.appendChild(preview_copy);
    }

    setImage(target_index, image_preview);
    openModal();
}

function insertImagesToModal(imgs_arr, target_div) {
    let modal = document.getElementById('modal');
    let modal_content_wrapper = document.getElementById('modal-content-wrapper');

    let image_preview = document.createElement('div');
    let image_list = document.createElement('div');

    image_preview.setAttribute('id', 'image-preview');
    image_list.setAttribute('id', 'image-list');

    image_preview.appendChild(target_div);
    for (let img of imgs_arr) {
        let copy_img = img.cloneNode(true);
        let div = document.createElement('div');
        copy_img.addEventListener('click', (e) => {
            image_preview.firstChild = e.target;
        });
        div.appendChild(copy_img);
        image_list.appendChild(div);
    }
    modal_content_wrapper.appendChild(image_list);
    modal_content_wrapper.appendChild(image_preview);

    openModal();
}


function albumHandler(div) {
    let wrapper = document.createElement('div');

    let title = createTitleForPopUpWindow('album');

    let input_album = document.createElement('input');
    let div_wrapper = document.createElement('div');

    let button_wrapper = document.createElement('div');
    let add = fastCreateNode('button', 'add');
    let cancel = fastCreateNode('button', 'cancel');
    let invalid = errorMessage('Invalid file format');
    let greaterThen4 = errorMessage('You can add 4 images');
    let lessThen4 = errorMessage('');

    setAttributes(div_wrapper, { 'id': 'figure_id' });
    setAttributes(input_album, { 'type': 'file', 'id': 'input_id' });

    setAttributes(add, { 'type': 'button', 'class': 'btn' });
    setAttributes(cancel, { 'type': 'button', 'class': 'btn' });

    input_album.addEventListener('change', () => {
        let result = previewFiles(div_wrapper, input_album, greaterThen4);
        result ? invalid.style.display = 'none' :
            invalid.style.display = 'block';
        lessThen4.style.display = 'none';
    });

    cancel.addEventListener('click', () => {
        cancelAddAlbum(input_album, div);
    });

    add.addEventListener('click', () => {
        if (div_wrapper.children.length === 4) {
            addAlbum(div_wrapper, input_album, div)
        } else {
            lessThen4.innerText = `Please add ${4 - div_wrapper.children.length} more image(s)`;
            lessThen4.style.display = 'block';
        }
    });

    button_wrapper.appendChild(add);
    button_wrapper.appendChild(cancel);
    button_wrapper.style.display = 'flex';
    button_wrapper.style.justifyContent = 'space-evenly';

    div_wrapper.style.minHeight = '23px'

    for (let x of [title, input_album, div_wrapper, invalid,
        greaterThen4, lessThen4, button_wrapper]) {
        wrapper.appendChild(x);
    }

    return wrapper
}


function bannerHandler(div) {
    let wrapper = document.createElement('div');
    let title = createTitleForPopUpWindow('image');
    let input_img = document.createElement('input');
    let img_wrapper = document.createElement('div');
    let img = document.createElement('img');
    let button_wrapper = document.createElement('div');
    let add = fastCreateNode('button', 'add');
    let cancel = fastCreateNode('button', 'cancel');
    let invalid = errorMessage('Invalid file format');

    setAttributes(input_img, { 'type': 'file' });
    setAttributes(img, { 'src': '', 'id': 'preview-image' });

    input_img.addEventListener('change', () => {
        let result = previewFile(input_img, img);
        result ? invalid.style.display = 'none' : invalid.style.display = 'block';
    });

    setAttributes(add, { 'type': 'button', 'class': 'btn' });
    setAttributes(cancel, { 'type': 'button', 'class': 'btn' });

    cancel.addEventListener('click', () => {
        cancelAddImage(input_img, img, div);
    });

    add.addEventListener('click', () => {
        let file = input_img.files[0];
        if (file && (/\.(jpe?g|png|gif)$/i.test(file.name))) {
            addImage(input_img, img, div, true);
        }
    });

    button_wrapper.appendChild(add);
    button_wrapper.appendChild(cancel);
    button_wrapper.style.display = 'flex';
    button_wrapper.style.justifyContent = 'space-evenly';

    img_wrapper.appendChild(img);

    for (x of [title, input_img, img_wrapper, invalid, button_wrapper]) {
        wrapper.appendChild(x);
    }

    return wrapper;
}

