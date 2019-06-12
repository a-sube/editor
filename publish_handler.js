/****************** PUBLISH HANDLER ********************/
document.getElementById('publish').addEventListener('click', (e) => {
    openPopupWindow(e.target, true);
});

let obj = {
    title: '',
    description: '',
    category: '',
    related_subjects: [],
};

function get_base64(img_src) {
    let r = /data:image\/(jp?eg|png|gif);base64,/g;
    return img_src.replace(r, '');
}

function is_data_correct() {
    if (!obj['title']) return false;
    if (!obj['description']) return false;
    if (!obj['category']) return false;
    if (obj['related_subjects'].length < 5
        || obj['related_subjects'].length > 10) return false;

    return true;
}

function slugify(str) {
    return str.trim().split(" ").map(x => x.toLowerCase()).join('-');
}

function send_data() {
    if (!article.querySelectorAll('.banner')[0]) {
        document.getElementById('black-background').remove();
        openDialog(`Please add main image`);
        return;
    }
    slugify(obj['title'])
    
    let clone = article.cloneNode(true),
        child = clone.querySelectorAll('[contenteditable]'),
        img_src_arr = [];

    for (let x of clone.querySelectorAll('#removable')) x.remove();
    for (let x of clone.querySelectorAll('.removable')) x.remove();
    for (let x of child) removeAttrs(x, ['contenteditable']);

    for (let i = 0; i < clone.querySelectorAll('img').length; i++) {
        let img = clone.querySelectorAll('img')[i];
        img_src_arr.push(img.src);
        img.src = ''; // slug/img_0
    }

    obj = {
        title: '',
        description: '',
        category: '',
        related_subjects: [],
    };

    openDialog('Preparing form data', null, null, true, 500)
    setTimeout(() => {
        openDialog('Preparing images', null, null, true, 1000)
    }, 1000)
    setTimeout(() => {
        openDialog('Preparing html', null, null, true, 500)
    }, 1500)
    setTimeout(() => {
        openDialog('Data successfully sent', null, null)
    }, 2000)
}


function publishHandler() {
    let wrapper = document.createElement('div');
    let messages = [
        `Press okay to complete next steps...`,
    ];
    for (let x of createMessage(messages)) wrapper.appendChild(x);
    let div = cancelPopover('ok');

    div.firstChild.addEventListener('click', () => {
        createForm();
    });

    wrapper.appendChild(div);
    return wrapper;
}

function createFormDiv() {
    let form_data = document.createElement('div');
    setAttributes(form_data, { 'class': 'form-input' });
    return form_data;
}

function createFormTitle() {
    let div = createFormDiv(),
        label = fastCreateNode('label', 'Title:'),
        input = document.createElement('input'),
        val = document.getElementsByTagName('h2')[0].innerText;
    setAttributes(label, { 'for': 'form-title' });
    setAttributes(input, {
        'type': 'text',
        'name': 'form-title',
        'id': 'form-title',
        'placeholder': '',
        'maxlength': '150',
        'required': true
    });

    input.value = val;
    obj['title'] = input.value;

    input.addEventListener('input', (e) => {
        obj['title'] = input.value;
    });

    for (let x of [label, input]) div.appendChild(x);

    return div;
}

function createFormDescription() {
    let form_data = createFormDiv(),
        label = fastCreateNode('label', 'Description:'),
        text_area = document.createElement('textarea'),
        p = fastCreateNode('p', `240 characters left`);

    setAttributes(label, { 'for': 'description' });
    setAttributes(text_area, {
        'name': 'description',
        'id': 'description',
        'placeholder': '',
        'required': true,
        'maxlength': '240',
    });

    text_area.addEventListener('keyup', (e) => {
        let count = 240 - e.target.value.length;
        if (!count) p.style.color = 'rgb(123, 30, 30)';
        else p.style.color = 'inherit';
        p.innerHTML = `${count} characters left`;
        obj['description'] = e.target.value;
    });

    for (let x of [label, text_area, p]) form_data.appendChild(x);
    return form_data;
}

function createFormOption(value) {
    let option = document.createElement('option');
    option.setAttribute('value', value);
    return option;
}


function createFormCategory() {
    let form_data = createFormDiv(),
        label = fastCreateNode('label', 'Category:'),
        input = document.createElement('input'),
        p = fastCreateNode('p', 'Please add valid category'),
        datalist = document.createElement('datalist');
    let options = ['Animals & Pets', 'Antiques & Collectibles',
        'Art & Photography', 'Auto & Cycles', 'Business & Finance',
        'Children', 'Computers & Electronics', 'Cooking, Food & Beverage',
        'Education', 'Entertainment & TV', 'Ethnic', 'Fashion & Style',
        'Health & Fitness', 'History', 'Hobbies', 'Home & Gardening', 'Humor',
        'International', 'Lifestyle', 'Literary', 'Local & Regional', 'Medical',
        'Men\'s', 'Music', 'News & Politics', 'Parenting', 'Psychology',
        'Science & Nature', 'Sports & Recreation', 'Teen', 'Women\'s',
    ];

    setAttributes(label, { 'for': 'category' })
    setAttributes(input, {
        'type': 'text',
        'list': 'categories',
        'name': 'category',
        'id': 'category',
        'placeholder': '',
        'required': true
    });
    setAttributes(datalist, { 'id': 'categories' });

    input.addEventListener('input', (e) => {
        obj['category'] = e.target.value;
    });

    p.style.display = 'none';
    p.style.color = 'rgb(123, 30, 30)';

    for (let x of options) datalist.appendChild(createFormOption(x));
    for (let x of [label, input, p, datalist]) form_data.appendChild(x);
    return form_data;
}


function createFormRelatedSubjects() {
    let form_data = createFormDiv(),
        label = fastCreateNode('label', 'Related Subjects:'),
        input = document.createElement('input'),
        datalist = document.createElement('datalist'),
        add = fastCreateNode('button', 'add'),
        p = fastCreateNode('p', 'Please add at least 5 subjects up to 10'),
        subjects_window = document.createElement('div'),
        options = [];

    setAttributes(form_data, { 'id': 'related-subjects' });
    setAttributes(label, { 'for': 'related-subjects' });
    setAttributes(input, {
        'type': 'text',
        'list': 'tags',
        'name': 'add-tags',
        'placeholder': '',
        'id': 'add-tags',
    });
    setAttributes(datalist, { 'id': 'tags' });
    setAttributes(add, { 'type': 'button', 'class': 'btn' })
    setAttributes(subjects_window, { 'id': 'related-subjects-window' });

    add.addEventListener('click', (e) => {
        if (input.value && subjects_window.children.length < 10) {
            obj['related_subjects'].push(input.value);
            subjects_window.appendChild(fastCreateNode('span', input.value));
            input.value = '';
        }
    });

    for (let x of options) datalist.appendChild(createFormOption(x));
    for (let x of [label, input, datalist, add,
        p, subjects_window]) form_data.appendChild(x);
    return form_data;
}

function createFormButtons() {
    let wrapper = document.createElement('div'),
        publish = fastCreateNode('button', 'publish'),
        cancel = fastCreateNode('button', 'cancel');

    cancel.addEventListener('click', () => {
        if (document.getElementById('black-background'))
            document.getElementById('black-background').remove();
    });

    publish.addEventListener('click', () => {
        if (is_data_correct()) send_data();
        else openDialog('Provided form was incorrect', null, null)
        document.getElementById('black-background').remove();
    });

    setAttributes(wrapper, { 'class': 'form-input-button' });
    setAttributes(publish, { 'type': 'button', 'class': 'btn' });
    setAttributes(cancel, { 'type': 'button', 'class': 'btn' });

    for (let x of [publish, cancel]) wrapper.appendChild(x);

    return wrapper;
}

function createFormMessage() {
    let div = document.createElement('div'),
        p = fastCreateNode('p', 'Please fill this form');

    setAttributes(div, { 'id': 'form-message' });

    div.appendChild(p);
    return div;
}

function createForm() {
    let background = document.createElement('div'),
        form = document.createElement('form'),
        inner = document.createElement('div');

    setAttributes(background, { 'id': 'black-background' });
    setAttributes(form, { 'id': 'form-data' });
    setAttributes(inner, { 'id': 'form-data-inner' });

    for (let x of [createFormTitle(), createFormDescription(),
    createFormCategory(), createFormRelatedSubjects(),
    createFormButtons()]) inner.appendChild(x);

    form.appendChild(createFormMessage())
    form.appendChild(inner);
    background.appendChild(form);
    body.appendChild(background);
}