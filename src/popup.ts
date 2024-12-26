import {getKeywords, setKeywords} from "./util";

let keywordTextArea = document.getElementById('numbered-textarea')! as HTMLTextAreaElement;
let updateButton = document.getElementById('update-button')!;

keywordTextArea.value = getKeywords().join('\n')

const sendUpdateMessage = () : void => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id as number, {"message": "update"}).catch(err => console.error(err));
    });
}

updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    let keywords = keywordTextArea.value.split(/\r?\n/);
    setKeywords(keywords);
    console.log(keywords);
    sendUpdateMessage()
    window.close();
})