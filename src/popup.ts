import {getKeywords, setKeywords} from "./util";

let keywordTextArea = document.getElementById('numbered-textarea')! as HTMLTextAreaElement;
let updateButton = document.getElementById('update-button')!;

keywordTextArea.value = getKeywords().join('\n')

updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    let keywords = keywordTextArea.value.split(/\r?\n/);
    setKeywords(keywords);
    console.log(keywords);
    window.close();
})