document.getElementById('delete').addEventListener('click', (e) => {
    openPopupWindow(e.target);
});

document.getElementById('add-link').addEventListener('click', (e) => {
    openPopupWindow(e.target);
});


function deleteHandler() {
    let wrapper = document.createElement('div');
    let messages = [
        `To delete section click on section 
        that needs to be removed. Small red cross will
        appear on the top right corner. Click on it`,

        `Images and albums always have small red
        cross on them. They can be removed the same 
        way as other sections`,

        `First three sections can't be removed, 
        since they are required`
    ];
    for (let x of createMessage(messages)) wrapper.appendChild(x);
    wrapper.appendChild(cancelPopover('ok'));
    return wrapper;
}

function linkMenuHandler() {
    let wrapper = document.createElement('div');
    let messages = [
        `Links can be added to the main Heading, Subheadings, Paragraphs,
        Lists and Image Captions. To do so highlight the text you want
        to add a link. Small menu window will appear that includes other
        options`,

        `Links can be removed as well. To remove them direct the cursor
        to link you choose. Remove option will appear`
    ]

    for (let x of createMessage(messages)) wrapper.appendChild(x);
    wrapper.appendChild(cancelPopover('ok'));

    return wrapper;
}