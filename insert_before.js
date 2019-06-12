/************************ INSERTION HANDLER ***************************/
document.getElementById('insert-before').addEventListener('click', (e) => {
    openPopupWindow(e.target);
});

// insert before
function insertBefore(element, what_to_insert) {
    try {
        element.parentNode.insertBefore(what_to_insert, element);
    } catch (e) {
        console.log(e);
    }
}

function get_tagname(tag) {
    if (tag.classList.contains('banner')) return;
    let obj = {
        'h3': 'subheading',
        'p': 'paragraph',
        'ul': 'list',
        'pre': 'code',
        'figure': 'image',
        'div': 'album',
    };
    let tag_name;
    if (tag.tagName.toLowerCase() === 'div') {
        for (let x of tag.classList) if (x === 'album-wrapper') 
                                                        tag_name = 'div';
    } else {
        tag_name = tag.tagName.toLowerCase();
    }
    return obj[tag_name];
}

function make_insertion(tag, section) {
    if (section === 'subheading') addElement('h3', tag);
    if (section === 'paragraph') addElement('p', tag);
    if (section === 'list') addList(tag);
    if (section === 'code') addCode(tag);
}

function cancelPopover(str_) {
    let div = document.createElement('div');
    let btn = fastCreateNode('button', str_);

    btn.addEventListener('click', () => {
        document.getElementById('popover').remove();
    });

    setAttributes(btn, {'type': 'button', 'class': 'btn'});

    div.style.textAlign = 'center';
    div.style.marginTop = '16px';
    btn.style.display = 'inline-block';

    div.appendChild(btn);

    return div;
}

function insertHandler(wrapper, tag) {
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild)
    let p = fastCreateNode('p', `Please select what do you want to insert`)
    let ul = document.createElement('ul');
    let tags = ['subheading', 'paragraph', 'list', 'code'];

    for (let x of tags) {
        let li = fastCreateNode('li', x);
        li.addEventListener('click', (e) => {
            make_insertion(tag, x);
            document.getElementById('popover').remove();
        });
        ul.appendChild(li);
    }

    p.style.color = '#c586c0';

    wrapper.appendChild(p);
    wrapper.appendChild(ul);
    wrapper.appendChild(cancelPopover('cancel'))

}

function insertMenu() {
    let wrapper = document.createElement('div');
    let p = fastCreateNode('p', `This is your structure,
                            please select section to insert before it`)
    let ul = document.createElement('ul');

    let div = document.createElement('div');
    let btn = fastCreateNode('button', 'cancel');
    // let structure = [];
    for (let i = 1; i < article.children.length; i++) {
        let tag = article.children[i];
        let tag_name = get_tagname(tag);
        
        if (tag_name) {
            let li = fastCreateNode('li', tag_name);
            li.addEventListener('click', (e) => {
                insertHandler(wrapper, tag);
            });
            ul.appendChild(li);
        }
        // structure.push(tag_name);
    }

    btn.addEventListener('click', () => {
        document.getElementById('popover').remove();
    });

    p.style.color = 'rgb(146, 158, 209)';

    wrapper.appendChild(p)
    wrapper.appendChild(ul);
    wrapper.appendChild(cancelPopover('cancel'));
    return wrapper;
}