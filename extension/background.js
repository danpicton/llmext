import { config } from './config.js';

/**
 * Initialize the context menus on extension installation.
 */
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    createContextMenus();
    // Set default popup for the extension action button
    chrome.action.setPopup({ popup: 'prompt.html' });
});

/**
 * Create context menus for the extension.
 */
function createContextMenus() {
    const contextMenuItems = [
        { id: "sendTextToBackend", title: "Process text", contexts: ["selection"] },
        { id: "sendTextToBackendPrompted", title: "Process text with prompt", contexts: ["selection"] },
        { id: "sendImageToBackend", title: "Process image", contexts: ["image"] },
        { id: "sendImageToBackendPrompted", title: "Process image with prompt", contexts: ["image"] }
    ];

    contextMenuItems.forEach(item => {
        chrome.contextMenus.create(item, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error creating context menu ${item.id}: ${chrome.runtime.lastError}`);
            } else {
                console.log(`${item.title} context menu created successfully`);
            }
        });
    });
}

/**
 * Handle context menu item clicks.
 * 
 * @param {Object} info - Information about the item clicked and the context where the click happened.
 * @param {Object} tab - The details of the tab where the click took place.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "sendTextToBackend":
            if (info.selectionText) {
                sendPayloadToServer(config.textEndpoint, { question: `${config.defaultTextPrompt}\n${info.selectionText}` });
            }
            break;
        case "sendTextToBackendPrompted":
            if (info.selectionText) {
                chrome.storage.local.set({ selectedText: info.selectionText, type: 'text' }, () => {
                    chrome.action.openPopup();
                });
            }
            break;
        case "sendImageToBackend":
            if (info.srcUrl) {
                sendPayloadToServer(config.imgEndpoint, { imageUrl: info.srcUrl });
            }
            break;
        case "sendImageToBackendPrompted":
            if (info.srcUrl) {
                chrome.storage.local.set({ selectedText: info.srcUrl, type: 'image' }, () => {
                    chrome.action.openPopup();
                });
            }
            break;
    }
});

/**
 * Send a payload to the specified server endpoint.
 * 
 * @param {string} endpoint - The server endpoint to send the payload to.
 * @param {Object} payload - The payload to send to the server.
 * @returns {Promise<Object>} - The response from the server.
 */
async function sendPayloadToServer(endpoint, payload) {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Payload successfully sent to the server:", result);
        return result;
    } catch (error) {
        console.error("Error sending payload to the server:", error);
    }
}

/**
 * Handle incoming messages from content scripts or other parts of the extension.
 * 
 * @param {Object} request - The message object.
 * @param {Object} sender - The sender of the message.
 * @param {Function} sendResponse - The callback to call with the response.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendSelectedText') {
        sendPayloadToServer(config.textEndpoint, {
            question: `Please apply this prompt "${request.prompt}" to the following text:\n${request.text}`
        });
    } else if (request.action === 'sendImageUrl') {
        sendPayloadToServer(config.imgEndpoint, {
            imageUrl: request.imageUrl,
            prompt: request.prompt
        });
    }
    sendResponse({ status: 'success' });
});