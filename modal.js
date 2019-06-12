function openModal(background=null) {
    let modal = document.getElementById('modal');
    modal.style.display = 'block';
    if (background) modal.style.backgroundColor = background;
}

function closeModal() {
    let modal = document.getElementById('modal');
    let child_node = modal.lastElementChild;
    while (child_node.firstChild) {
        child_node.removeChild(child_node.firstChild);
    }
    modal.style.display = 'none';
    if (document.getElementById('editor').style.display === 'none') {
        document.getElementById('editor').style.display = 'flex';
    }
}

function createModal() {
    let modal = document.createElement('div');
    let span = document.createElement('span');
    let modal_content_wrapper = document.createElement('div');
    let times = document.createTextNode('&times;');

    span.appendChild(times);

    modal.setAttribute('id', 'modal');
    span.setAttribute('id', 'close-modal');
    modal_content_wrapper.setAttribute('id', 'modal-content-wrapper');

    modal.appendChild(span);
    modal.appendChild(modal_content_wrapper);

    document.body.appendChild(modal);
    span.onclick = closeModal();
}


