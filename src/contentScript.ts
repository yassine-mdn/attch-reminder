console.log("Content script loaded!");


//still super slow (not really but still a O(n*m) complexity ain't cute)
const setupNewMessageObserver = () => {

    const processedNodes = new WeakSet();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation, mutationKey) => {
            mutation.addedNodes.forEach((node, key) => {
                if (node instanceof Element) {
                    const targetDiv = node.querySelector("div[aria-label='New Message']");

                    if (targetDiv && !processedNodes.has(targetDiv)) {
                        processedNodes.add(targetDiv);
                        console.log(`Message Container Found! in node #${key} of mutation with key #${mutationKey}`);

                        targetDiv.addEventListener("input", inputListener(targetDiv));
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
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