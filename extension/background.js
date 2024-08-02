import { config } from './config.js';

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");

    // Create context menu for selected text
    chrome.contextMenus.create({
        id: "sendToTestServer",
        title: "Send to test server",
        contexts: ["selection"], // Context menu for selected text
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error creating context menu: ${chrome.runtime.lastError}`);
        } else {
            console.log("Text context menu created successfully");
        }
    });

    // Create context menu for selected text with prompt
    chrome.contextMenus.create({
        id: "sendToTestServerWithPrompt",
        title: "Send to test server with prompt",
        contexts: ["selection"], // Context menu for selected text
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error creating context menu: ${chrome.runtime.lastError}`);
        } else {
            console.log("Text context menu with prompt created successfully");
        }
    });

    // Create context menu for images
    chrome.contextMenus.create({
        id: "sendImageToTestServer",
        title: "Send image to test server",
        contexts: ["image"], // Context menu for images
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error creating context menu: ${chrome.runtime.lastError}`);
        } else {
            console.log("Image context menu created successfully");
        }
    });

    // Create context menu for images with prompt
    chrome.contextMenus.create({
        id: "sendImageToTestServerWithPrompt",
        title: "Send image to test server with prompt",
        contexts: ["image"], // Context menu for images
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error creating context menu: ${chrome.runtime.lastError}`);
        } else {
            console.log("Image context menu with prompt created successfully");
        }
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendToTestServer" && info.selectionText) {
        sendPayloadToServer(config.textEndpoint, { question: config.defaultTextPrompt + '/n' + info.selectionText });
    }

    if (info.menuItemId === "sendToTestServerWithPrompt" && info.selectionText) {
        chrome.windows.create({
            url: `prompt.html?text=${encodeURIComponent(info.selectionText)}`,
            type: "popup",
            width: 400,
            height: 300
        });
    }

    if (info.menuItemId === "sendImageToTestServer" && info.srcUrl) {
        sendPayloadToServer(config.imgEndpoint, { imageUrl: info.srcUrl });
    }

    if (info.menuItemId === "sendImageToTestServerWithPrompt" && info.srcUrl) {
        chrome.windows.create({
            url: `prompt.html?imageUrl=${encodeURIComponent(info.srcUrl)}`,
            type: "popup",
            width: 400,
            height: 300
        });
    }
})

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
            throw new Error("Network response was not ok " + response.statusText);
        }

        const result = await response.json();
        console.log("Payload successfully sent to the server:", result);
        return result;
    } catch (error) {
        console.error("Error sending payload to the server:", error);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendSelectedText') {
        sendPayloadToServer(config.textEndpoint, { question: 'Please apply this prompt "' + request.prompt + '" to the following text:/n' + request.text });
    } else if (request.action === 'sendImageUrl') {
        sendPayloadToServer(config.imgEndpoint, { imageUrl: request.imageUrl, prompt: request.prompt });
    }
    sendResponse({ status: 'success' });
});
