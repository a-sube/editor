/**************** LIST HANDLER ******************/
document.getElementById('add-list').addEventListener('click', () => {
    addList();
});

function addListChild(tag) {
    if (!checkCount('li', 5)) return;
    let li = document.createElement('li');

    let text = document.createTextNode('');
    makeContentEditable(li);
    li.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            if (li.textContent) {
                addListChild(tag);

                // if (e.originalTarget) e.originalTarget.lastElementChild.remove();
                if (e.path) e.path[0].lastElementChild.remove();
            } else {
                li.remove();
                removeRemovable();
            }
        }
    });
    li.addEventListener('mouseup', (e) => {
        handleSelection(e);
    });
    checkLength(li, 86);
    addRemovable(li, { 'a': { 'top': '-16px' } });
    li.appendChild(text);
    tag.appendChild(li);
    li.focus();
}

function addList(insertion_tag=null) {
    if (!checkCount('ul', 1)) return;

    let ul = document.createElement('ul');
    let li = document.createElement('li');
    let text = document.createTextNode('To start a new row simply press enter. To end a list leave row empty and hit enter.');

    li.appendChild(text);
    li.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            if (li.textContent) {
                addListChild(ul);
                if (e.originalTarget) e.originalTarget.lastElementChild.remove();
                if (e.path) e.path[0].lastElementChild.remove();
            } else {
                li.remove();
                removeRemovable();
            }
        }
    });
    li.addEventListener('mouseup', (e) => {
        handleSelection(e);
    });

    checkLength(li, 86);

    addRemovable(li, { 'a': { 'top': '-16px' } });
    makeContentEditable(li);
    ul.appendChild(li);
    if (!insertion_tag) article.appendChild(ul);
    else {
        insertBefore(insertion_tag, ul)
    }
}