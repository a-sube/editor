/**************** GLOBAL VARS ******************/
let article = document.getElementById('article'),
    html = document.documentElement,
    body = document.body;


window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    return confirm();
});


/**************** HELPERS ******************/
const makeContentEditable = (tag) =>
    tag.setAttribute('contenteditable', 'true');

const setAttributes = (el, attrs) => {
    for (let k in attrs) el.setAttribute(k, attrs[k]);
}

function startProgressBar(el, time) {
    let width = 0,
        id = setInterval(frame, time/110);

    function frame() {
        if (width >= 100) clearInterval(id);
        else {
            width++;
            el.style.width = width + '%';
        }
    }
}


function createProgressBar(time) {
    let loading = document.createElement('div'),
        loading_bar = document.createElement('div'),
        loading_progress = document.createElement('div');

    setAttributes(loading, {'id': 'loading'});
    setAttributes(loading_bar, {'id': 'loading-bar'});
    setAttributes(loading_progress, {'id': 'loading-progress'});

    loading_bar.appendChild(loading_progress);
    loading.appendChild(loading_bar);
    startProgressBar(loading_progress, time)
    return loading;
}

// dialog window
function openDialog(message, func, arg, disabled = false, time) {
    if (document.getElementById('dialog')) {
        document.getElementById('dialog').remove();
    }
    let div = document.createElement('div');
    let p = document.createElement('p');
    let text = document.createTextNode(message);
    let yes, no;
    let progressBar;


    if (!disabled) {
        if (!func) {
            yes = fastCreateNode('button', 'ok');

            yes.addEventListener('click', () => {
                div.remove();
            });

            yes.style.marginLeft = '0'
        } else {
            yes = fastCreateNode('button', 'yes');
            no = fastCreateNode('button', 'no');

            yes.addEventListener('click', () => {
                func(arg);
                div.remove();
            });

            no.addEventListener('click', () => {
                div.remove();
            });
        }

        setAttributes(yes, { 'type': 'button', 'class': 'btn' });
        if (no) setAttributes(no, { 'type': 'button', 'class': 'btn' });

        div.appendChild(yes);
        if (no) div.appendChild(no);
    } else {
        progressBar = createProgressBar(time);
    }


    div.setAttribute('id', 'dialog');
    p.appendChild(text);
    div.appendChild(p);
    if (yes) div.appendChild(yes);
    if (no) div.appendChild(no);
    if (progressBar) {
        div.appendChild(progressBar);
    };
    article.appendChild(div);
}

// error window 
function errorMessage(message) {
    let p = fastCreateNode('p', message);
    p.style.fontWeight = '400';
    p.style.display = 'none';
    p.style.color = 'rgb(223, 103, 103)';
    p.style.margin = '8px';
    return p;
}

// count checker
function checkCount(tag, max_count, className = null) {
    let count;
    if (tag) count = article.getElementsByTagName(tag).length;
    else count = article.getElementsByClassName(className).length;
    if (count >= max_count) {
        if (className === 'banner') openDialog(`You can add only one main image`, null, null);
        else openDialog('Sorry, since this is demo version, features are limited',
            null, null);
        return 0;
    }
    return 1;
}

// input length checker 
function checkLength(tag, max_length, className = null) {
    tag.addEventListener('input', (e) => {
        if (e.target.innerText.length >= max_length) {
            openDialog('Sorry, since this is demo version, features are limited',
                null, null);
            e.target.innerHTML = e.target.innerHTML.slice(0, max_length);
        }
    });
}

checkLength(article.getElementsByTagName('h2')[0], 70);
checkLength(article.getElementsByTagName('h3')[0], 70);
checkLength(article.getElementsByTagName('p')[0], 250);


function applyStyle(tag, options) {
    for (let k in options) tag.style[k] = options[k];
}


function removeTag(tag) {
    if (tag.tagName.toLowerCase() === 'li') {
        if (tag.parentNode.children.length <= 2) tag.parentNode.remove();
    }
    if (tag.previousSibling.id === 'removable'
        || tag.previousSibling.classList.contains('removable')) {
        tag.previousSibling.remove();
        tag.remove();
    }
}

function createMessage(messages) {
    let arr = [];
    for (let x of messages) {
        arr.push(fastCreateNode('p', x));
    }
    return arr;
}


/**************** CREATE REMOVABLE DIV ******************/
function createRemovable(styles, cls = 'id') {
    let div = document.createElement('div');
    let a = document.createElement('a');
    let times = document.createTextNode('\u00D7');
    a.addEventListener('click', (e) => {
        e.preventDefault();
        openDialog('Are you sure you want to remove this?', removeTag, e.target.parentNode.nextSibling);
    });

    for (let x of [div, a]) {
        applyStyle(x, styles[x.tagName.toLowerCase()]);
    }

    a.appendChild(times);
    div.appendChild(a);
    div.setAttribute(cls, 'removable');
    return div;
}

function removeRemovable() {
    if (document.getElementById('removable')) {
        document.getElementById('removable').remove();
    }
}

function addRemovable(tag, styles = {}) {
    tag.addEventListener('focus', (e) => {
        e.preventDefault();
        removeRemovable();
        let removable = createRemovable(styles);
        insertBefore(tag, removable);
        removable.style.display = 'block';
    });
}


/**************** PARAGRAPH AND SUBHEADING HANDLER ******************/
document.getElementById('add-subheading').addEventListener('click', () => {
    addElement('h3')
});

document.getElementById('add-paragraph').addEventListener('click', () => {
    addElement('p')
});


function addElement(tag, inserion_tag = null) {
    if (!checkCount(tag, 2)) return;

    let text = tag === 'h3' ? 'Your new subheading' : 'Start your new paragraph';
    let elemet = document.createElement(tag);
    let node = document.createTextNode(text);

    makeContentEditable(elemet);
    addRemovable(elemet);

    elemet.addEventListener('mouseup', (e) => {
        handleSelection(e);
    });
    tag === 'h3' ? checkLength(elemet, 70) : checkLength(elemet, 250)

    elemet.appendChild(node);

    if (!inserion_tag) article.appendChild(elemet);
    else insertBefore(inserion_tag, elemet);
}


/**************** REMOVE ATTRIBUTES FUNCTION **************/
function removeAttrs(el, arr) {
    for (let x of arr) el.removeAttribute(x);
}


/**************** POPUP MENU WINDOW ******************/
function createInput(tag_id) {
    let div = document.createElement('div');
    div.setAttribute('id', 'popover-input');
    if (tag_id === 'add-image') {
        div.appendChild(imageHandler(div));
        return div;
    }
    if (tag_id === 'add-album') {
        div.appendChild(albumHandler(div));
        return div;
    }
    if (tag_id === 'add-link') {
        div.appendChild(linkMenuHandler())
        return div;
    }
    if (tag_id === 'delete') {
        div.appendChild(deleteHandler());
        return div;
    }
    if (tag_id === 'insert-before') {
        div.appendChild(insertMenu());
        return div;
    }
    if (tag_id == 'save-work') {
        div.appendChild(saveWorkMenu())
        return div;
    }
    if (tag_id == 'send-to-review') {
        div.appendChild(sendToReview())
        return div;
    }
    if (tag_id == 'publish') {
        div.appendChild(publishHandler())
        return div;
    }
    if (tag_id == 'add-banner') {
        div.appendChild(imageHandler(div, true))
        return div;
    }

}



function openPopupWindow(elemet, right = null) {
    let obj = {
        'add-image': 'image-wrapper',
        'add-album': 'album-wrapper',
        'add-banner': 'banner',
    };
    let className = obj[elemet.id];
    if (className) if (!checkCount(null, 1, className)) return;
    //check if exists
    let popover = document.getElementById('popover');
    if (popover) popover.remove();

    let input = createInput(elemet.id);
    let div = document.createElement('div');
    div.setAttribute('id', 'popover');
    div.appendChild(input);
    document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) div.remove();
    });
    right ? div.classList.add('right') : div.classList.add('left');

    l = article.offsetHeight

    elemet.parentNode.insertBefore(div, elemet);
}

for (let tag of document.querySelectorAll('[contenteditable]')) {
    tag.addEventListener('mouseup', (e) => {
        e.preventDefault();
        handleSelection(e);
    });
}

function validTag(element) {
    let tag = element.tagName;
    let valid_tags = ['P', 'H3', 'H2', 'LI', 'FIGCAPTION'];
    for (let x of valid_tags) if (x === tag) return true;
    return false;
}

function checkLinkItalicBold(element) {
    let tag = element.tagName;
    if (tag !== 'A' && tag !== 'I' && tag !== 'B') return false;
    return validTag(element.parentNode);
}

function getParentElementTagName(element) {
    return element.parentElement.tagName;
}

function checkChildren(childNodes, anchorNode) {
    for (let x of childNodes) if (x === anchorNode) return true;
    return false;
}

function handleSelection() {
    let selected = document.getSelection();
    if (!selected.isCollapsed) {
        if (selected.anchorNode.parentNode === selected.focusNode.parentNode) {
            if (validTag(selected.anchorNode.parentElement)
                || checkLinkItalicBold(selected.anchorNode.parentElement)) {
                // selectionMenu(selected);
                selectionMenu(selected.getRangeAt(0));
            }
        }
    }
}


function selectionMenu(range) {

    if (document.getElementById('link-italic-bold')) {
        document.getElementById('link-italic-bold').remove();
    }


    let div = document.createElement('div');

    let btn_1 = fastCreateNode('button', 'link');
    let btn_2 = fastCreateNode('button', 'italic');
    let btn_3 = fastCreateNode('button', 'bold');

    let coords = range.getBoundingClientRect();
    let left = coords.x + 'px';
    let top = (document.documentElement.scrollTop + coords.y) - 32 + 'px';

    div.setAttribute('id', 'link-italic-bold')
    div.style.position = 'absolute';


    div.style.left = left;
    div.style.top = top;
    let obj = { x: left, y: top }


    btn_1.addEventListener('click', () => {
        handleLink(range, obj);
    });

    btn_2.addEventListener('click', () => {
        handleItalicBold(range, 'i', obj);
    });

    btn_3.addEventListener('click', () => {
        handleItalicBold(range, 'b', obj);
    });



    for (let x of [btn_1, btn_2, btn_3]) {
        x.setAttribute('class', 'sel-menu');
        div.appendChild(x);
    }

    article.appendChild(div);
    document.addEventListener('click', (e) => {
        if (document.getElementById('link-italic-bold')) {
            if (range.commonAncestorContainer.parentNode !== e.target
                && btn_1 !== e.target
                && btn_2 !== e.target
                && btn_3 !== e.target) {

                if (!document.getElementById('link-window')) {
                    div.remove();
                }
            }
        }
    });
}



// simple tags only e.g: <p>test</p>, <button>add</button>, <i>italic</i> etc;
function fastCreateNode(tag, innerText) {
    let el = document.createElement(tag);
    let text = document.createTextNode(innerText);
    el.appendChild(text);
    return el;
}

function handleLink(range, obj) {

    let coords = range.getBoundingClientRect();

    let div = document.createElement('div');
    let form = document.createElement('form');
    let label = fastCreateNode('label', 'Please enter an https:// URL');
    let input = document.createElement('input');
    let p = fastCreateNode('p', 'Invalid URL');
    let add = fastCreateNode('button', 'add');
    let cancel = fastCreateNode('button', 'cancel');

    div.setAttribute('id', 'link-window');
    label.setAttribute('for', 'url-window');
    setAttributes(input, {
        'type': 'url',
        'name': 'url-window',
        'id': 'url-window',
        'placeholder': 'https://example.com',
        'pattern': 'https://.*',
        'required': 'true',
    });
    setAttributes(add, { 'type': 'button', 'class': 'btn' });
    setAttributes(cancel, { 'type': 'button', 'class': 'btn' });


    for (let tag of [label, input, p, add, cancel]) form.appendChild(tag);
    div.appendChild(form);

    div.style.left = coords.x + 'px';
    div.style.top = (document.documentElement.scrollTop + coords.y) + 'px';
    div.style.position = 'absolute';

    article.appendChild(div);

    input.addEventListener('input', (e) => {
        if (e.target.value === '') p.style.display = 'none';
        else if (!validURL(e.target.value)) p.style.display = 'block';
        else {
            p.innerText = 'Valid URL';
            p.style.color = '#3dcc3d';
        }
    });

    cancel.addEventListener('click', (e) => {
        remove();
    });

    add.addEventListener('click', (e) => {
        if (!input.value) {
            p.style.display = 'block';
            p.innerText = 'Please enter an https:// URL';
        }
        if (validURL(input.value)) {
            addLink(range, input.value, obj);
        }
    });

    function remove() {
        document.getElementById('link-italic-bold').remove();
        document.getElementById('link-window').remove();
    }

    function validURL(input) {
        let re = new RegExp(/^(?:https:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi);
        return re.test(input);
    }
}

function removeSpacesInRange(range) {
    let start = range.startOffset;
    let end = range.endOffset;
    let str = range.toString();

    let i = 0, j = str.length - 1;

    while (str[i].charCodeAt() === 160 || str[i].charCodeAt() === 32) i++
    while (str[j].charCodeAt() === 160 || str[j].charCodeAt() === 32) j--;

    range.setStart(range.commonAncestorContainer, start + i);
    range.setEnd(range.commonAncestorContainer, end - (str.length - 1 - j));
    return range;
}

function askToRemove(tag, range, str, obj) {
    if (document.getElementById('link-italic-bold')) {
        document.getElementById('link-italic-bold').remove();
    }
    let name = tag.tagName === 'A' ? 'link' :
        tag.tagName === 'I' ? 'italic' : 'bold';
    let div = document.createElement('div');
    let btn = fastCreateNode('button', 'remove ' + name);

    div.setAttribute('id', 'link-italic-bold');
    div.style.position = 'absolute';
    div.style.left = obj.x;
    div.style.top = obj.y;
    setAttributes(btn, { 'type': 'button', 'class': 'sel-menu' });
    div.appendChild(btn);
    article.appendChild(div);
    tag.addEventListener('mouseleave', (e) => {
        setTimeout(() => {
            div.remove();
        }, 1000);
    });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (name === 'link') removeLink(tag, range, str, obj);
        else removeItalicBold(tag, range, str, obj);
    });
}

function removeLink(tag, range, str, obj) {
    let text = document.createTextNode(str);
    tag.remove();
    range.insertNode(text);
    
}


function removeItalicBold(tag, range, str, obj) {
    let text = document.createTextNode(str);
    tag.remove();
    range.insertNode(text);
}

function addLink(range, value, obj) {
    removeSpacesInRange(range)
    let str = range.toString();
    let a = fastCreateNode('a', str);
    a.href = value;
    a.setAttribute('contenteditable', 'false');
    a.addEventListener('mouseover', (e) => {
        askToRemove(e.target, range, str, obj);
    });
    a.addEventListener('touchstart', (e) => {
        askToRemove(e.target, range, str, obj);
    });
    range.deleteContents();
    range.insertNode(a);
}

function handleItalicBold(range, tag, obj) {
    removeSpacesInRange(range);
    let str = range.toString();
    let tag_ = fastCreateNode(tag, str);
    tag_.setAttribute('contenteditable', 'false');
    tag_.addEventListener('mouseover', (e) => {
        askToRemove(e.target, range, str, obj);
    });
    range.deleteContents();
    range.insertNode(tag_);
}


window.onload = function() {
    document.getElementById('editor').style.display = 'none';
    
    openModal();
    let modal = document.getElementById('modal'),
        div = document.getElementById('modal-content-wrapper'),
        h2 = fastCreateNode('h2', 'Welcome!'),
        p1 = fastCreateNode('p', 
        `This is content publishing part of journal-like app. Here I prepared almost every basics that helps write articles. This version doesn't connected to the server, so it doesn't publish anything, but it demonstrates workflow.`),
        // p2 = fastCreateNode('p', 
        // `Currently, this particular part of an app doesn't support small screens (I'm sorry if you'r reading this from phone). There might be issues with accessibility and other important parts, I'm sorry for that. 
        // `),
        p3 = fastCreateNode('p', 
        `Thanks!
        `),
        ok = fastCreateNode('button', 'ok');

    setAttributes(h2, {'class': 'welcome'});
    for (let x of [p1, p3]) setAttributes(x, {'class': 'welcome'});
    setAttributes(ok, {'class': 'btn'});

    ok.onclick = closeModal;

    editor.style.display = 'none';

    ok.style.float = 'right';
    ok.style.fontSize = '16px';
    ok.style.background = 'transparent';
    ok.style.margin = '16px 0 0';

    if (window.innerWidth < 800) { 
        div.style.width = '100%';
        ok.style.margin = '16px 16px 0';
    }

    for (let x of [h2, p1, p3, ok]) div.appendChild(x);
}

document.getElementById('left-arrow').addEventListener('click', (e) => {
    open_close_tool_box(e.target, 'left-tool-box');
});

document.getElementById('right-arrow').addEventListener('click', (e) =>{
    open_close_tool_box(e.target, 'right-tool-box');
});

function open_close_tool_box(el, str_) {
    let menu = document.getElementById(str_);
    menu.classList.toggle('active');
    el.parentElement.classList.toggle('active');
}
