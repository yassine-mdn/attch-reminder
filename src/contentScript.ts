console.log("Content script loaded!");

// TODO: Bugfix detect load page state
// TODO: clean up the code

const htmlContent = `
        <div style="
            flex-grow: 0;
            padding: 8px;
            background-color: rgb(248, 233, 233);
            position: relative;
            color: rgb(189, 39, 30);
            font-size: 1rem;
            line-height: 1.4286rem; 
            font-weight: 500;
        "
        id="attachment-missing-warning"
        >
            This is your styled text inside the div.
        </div>
    `;

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

    let emailText = element.textContent ?? "";
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

const hasAttachments = (element: Element): boolean => {
    const selector = "div[aria-label^='Attachment']";
    return element.querySelector(selector) !== null;
}

const hasAttachmentWarning = (element: Element) : boolean => {

    const injectedElement = document.getElementById("attachment-missing-warning");
    return element.contains(injectedElement)
}

const addAttachmentWarning = (element: Element): void => {
    if(hasAttachmentWarning(element)) return;
    element.insertAdjacentHTML('afterbegin', htmlContent);
}

const removeAttachmentWarning = (element: Element): void => {
    if(!hasAttachmentWarning(element)) return;
    const injectedElement = document.getElementById("attachment-missing-warning");
    injectedElement?.remove();
}


const inputListener = (element: Element) => (e: Event) => {

    if (!element) return;

    const emailBody = getEmailBodyElement(element);
    if (!emailBody) return;

    const emailText = getEmailBodyText(emailBody);

    if (!emailText.includes("test") && hasAttachmentWarning(element)){
        removeAttachmentWarning(emailBody.parentElement  as Element);
        return;
    }

    if (!emailText.includes("test")) return;

    if (!hasAttachments(element)) {
        addAttachmentWarning(emailBody.parentElement as Element);
    } else {
        removeAttachmentWarning(emailBody.parentElement  as Element);
    }
};


const main = async () => {

    setupNewMessageObserver();
};

main();