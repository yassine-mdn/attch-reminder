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
        You may have forgotten to add an attachment
    </div>
`;

const keywords = [
    // English
    "attached",
    "attachment",
    "enclosed",
    "included",

    // French
    "pièce jointe",
    "pj",
    "ci-joint",
    "document joint",
    "fichier joint",
    "inclus",
    "vous joins",
];

const setupNewMessageObserver = () => {

    const processedNodes = new WeakSet();

    const mainObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                    const emailContainer = node.querySelector("div[aria-label='New Message']");
                    if (emailContainer && !processedNodes.has(emailContainer)) {
                        processedNodes.add(emailContainer);
                        checkAndProcessEmailContainer(emailContainer);
                    }
                }
            });
        });
    });

    mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

const checkAndProcessEmailContainer = (emailContainer: Element) => {

    const containerObserver = new MutationObserver(() => {
        const emailBody = getEmailBodyElement(emailContainer);
        if (!emailBody) return;

        const emailText = getEmailBodyText(emailBody);

        if (!includesKeywords(emailText,keywords) && hasAttachmentWarning(emailContainer)){
            removeAttachmentWarning(emailBody.parentElement  as Element);
            return;
        }

        if (!includesKeywords(emailText,keywords)) return;

        if (!hasAttachments(emailContainer)) {
            addAttachmentWarning(emailBody.parentElement  as Element);
        } else {
            removeAttachmentWarning(emailBody.parentElement  as Element);
        }
    });

    containerObserver.observe(emailContainer, {
        childList: true,
        subtree: true,
        characterData: true
    });

};

const getEmailBodyText = (emailBody: Element): string => {

    return emailBody.textContent ?? "";
};

const getEmailBodyElement = (emailContainer: Element): Element | null => {

    const selector = "div[aria-label='Message Body'], div[aria-label='Message text'], div.editable";
    return emailContainer.querySelector(selector);
};


const hasAttachments = (element: Element): boolean => {

    const selector = "div[aria-label^='Attachment']";
    return element.querySelector(selector) !== null;
};

const hasAttachmentWarning = (element: Element): boolean => {

    const injectedElement = document.getElementById("attachment-missing-warning");
    return element.contains(injectedElement);
};

const addAttachmentWarning = (emailBody: Element): void => {

    if (hasAttachmentWarning(emailBody)) return;
    emailBody.insertAdjacentHTML('afterbegin', htmlContent);
};

const removeAttachmentWarning = (emailBody: Element): void => {

    if (!hasAttachmentWarning(emailBody)) return;
    const injectedElement = document.getElementById("attachment-missing-warning");
    injectedElement?.remove();
};

const includesKeywords = (emailText: string, keywords: string[]): boolean => {

    return keywords.some(keyword => emailText.includes(keyword));
};

const main = async () => {

    setupNewMessageObserver();
};

main();