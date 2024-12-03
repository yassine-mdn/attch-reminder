console.log("Content script loaded!");

const getEmailBodyText = (element: Element): string => {

    let emailText = element.innerHTML;
    console.log("Email text : ", emailText);
    return emailText;
}

const getEmailBodyElement = (): Element | null => {

    const selector = "div[aria-label='Message Body'], div[aria-label='Message text'], div.editable";
    return document.querySelector(selector);
}

const observeEmailBody = () => {
    const element = getEmailBodyElement();
    if (element) {
        const observer = new MutationObserver(() => {
            getEmailBodyText(element);
        });
        observer.observe(element, { childList: true, subtree: true });
    }
};


const inputListener = () => (e: Event) => {
    const element = getEmailBodyElement();
    if (element)
        getEmailBodyText(element);
    return;
};


const main = async () => {
    observeEmailBody();
    document.addEventListener("input", inputListener());
};

main();