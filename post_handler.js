/**************** POST HANDLER ******************/
function post_handler(url, content_type, content) {
    var xhr = new XMLHttpRequest();
    // '/article/post/'
    xhr.open('POST', url, true);

    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    xhr.setRequestHeader('Content-Type', content_type);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            return 1;
        } else {
            return 0;
        }
    }
    xhr.send(content)
}