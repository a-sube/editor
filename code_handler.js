document.getElementById('add-code').addEventListener('click', () => {
    addCode();
});

function addCode(insertion_tag=null) {
    // <pre><code contenteditable="true" spellcheck="false">Your code goes here</code></pre>
    if (!checkCount('code', 1)) return;
    let pre = document.createElement('pre');
    let code = document.createElement('code');
    let text = document.createTextNode('for (int i = 0; i < 10; i++) {};');

    setAttributes(pre, {'contenteditable': 'true', 'spellcheck': 'false'});
    checkLength(pre, 130);
    code.appendChild(text);
    pre.appendChild(code);
    addRemovable(pre);
    if (!insertion_tag) article.appendChild(pre);
    else insertBefore(insertion_tag, pre);
}