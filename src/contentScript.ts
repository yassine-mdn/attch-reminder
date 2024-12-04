console.log("Content script loaded!");


/*let cachedContainers: NodeListOf<Element> | null = null;
let lastCheckTime = 0;
const CACHE_DURATION = 500;


const getEmailContainerElements = (): NodeListOf<Element> => {
    const currentTime = Date.now();

    if (cachedContainers &&
        (currentTime - lastCheckTime) < CACHE_DURATION) {
        return cachedContainers;
    }

    const selector = "div[aria-label='New Message']";
    cachedContainers = document.querySelectorAll(selector);
    lastCheckTime = currentTime;

    return cachedContainers;
}*/


//still super slow
const setupNewMessageObserver = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node instanceof Element &&
                    node.querySelector("div[aria-label='New Message']")) {
                    console.log("Message Container Found!")
                    document.addEventListener("input", inputListener(node));
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
    });
};

const getEmailBodyText = (element: Element): string => {

    let emailText = element.innerHTML;
    console.log("Email text : ", emailText);
    return emailText;
}

const getEmailBodyElement = (parentElement: Element): Element | null => {

    const selector = "div[aria-label='Message Body'], div[aria-label='Message text'], div.editable";
    return parentElement.querySelector(selector);
};


/*const observeEmailBody = (messageContainers : NodeListOf<Element>) => {
    messageContainers.forEach(element => {
        const emailBodyElement = getEmailBodyElement(element);

        if (!emailBodyElement) return;

        const observer = new MutationObserver(() => {
            getEmailBodyText(emailBodyElement);
        });
        observer.observe(emailBodyElement, {childList: true, subtree: true});
    })

};*/

const getAttachments = (element: Element): NodeListOf<Element> => {
    const selector = "div[aria-label^='Attachment']";
    return element.querySelectorAll(selector);
}

const inputListener = (element: Element) => (e: Event) => {

    if (!element) return;

    const emailBody = getEmailBodyElement(element);
    if (!emailBody) return;

    const emailText = getEmailBodyText(emailBody);
    if (!emailText.includes("test")) return;

    const attachments = getAttachments(element);
    console.log(`Received ${attachments.length} attachments`);

};


const main = async () => {

    setupNewMessageObserver();
};

main();