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
        { id: "sendTextToBackendPrompted", title: "Process text with prompt", contexts: ["selection"] }
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

        // Inject the content script into the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) { // Check if there's at least one active tab
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['modal.js']
                }, () => {
                    // Send a message to the content script to show the modal
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'showModal', content: result.text });
                });
            } else {
                console.error("No active tab found.");
            }
        });

        return result;
    } catch (error) {
        console.error("Error sending payload to the server:", error);
    }
}

/**
 * Get selected text from the active tab.
 * 
 * @returns {string} - The selected text.
 */
function getSelectedText() {
    return window.getSelection().toString();
}

// Add listener for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getSelectedText,
            }, (results) => {
                const selectedText = results[0]?.result;
                if (command === "sendTextToBackend" && selectedText) {
                    sendPayloadToServer(config.textEndpoint, { question: `${config.defaultTextPrompt}\n${selectedText}` });
                } else if (command === "sendTextToBackendPrompted" && selectedText) {
                    chrome.storage.local.set({ selectedText, type: 'text' }, () => {
                        chrome.action.openPopup();
                    });
                }
            });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendSelectedText') {
        sendPayloadToServer(config.textEndpoint, {
            question: `Please apply this prompt "${request.prompt}" to the following text:\n${request.text}`
        });
    }
    sendResponse({ status: 'success' });
});


        