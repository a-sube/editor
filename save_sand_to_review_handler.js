/***************** SAVE AND SAVE TO REVIEW HANDLERS *****************/

document.getElementById('save-work').addEventListener('click', (e) => {
    openPopupWindow(e.target, true)
});

document.getElementById('send-to-review').addEventListener('click', (e) => {
    openPopupWindow(e.target, true)
});


function saveWorkMenu() {
    let wrapper = document.createElement('div');
    let messages = [
        `Saved!`,

    ];
    for (let x of createMessage(messages)) wrapper.appendChild(x);
    wrapper.appendChild(cancelPopover('ok'));
    return wrapper;
}

function sendToReview() {
    let wrapper = document.createElement('div');
    let messages = [
        `A work has been sent to review!`,
    ];
    for (let x of createMessage(messages)) wrapper.appendChild(x);
    wrapper.appendChild(cancelPopover('ok'));
    return wrapper;
}