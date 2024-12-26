let keywordTextArea = document.getElementById('numbered-textarea')! as HTMLTextAreaElement;
let updateButton = document.getElementById('update-button')!;

keywordTextArea.value = JSON.parse(localStorage.getItem("keywords") ?? '').join('\n') ?? ''

updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    let keywords = keywordTextArea.value.split(/\r?\n/);
    localStorage.setItem("keywords", JSON.stringify(keywords));
    console.log(keywords);
    window.close();
})