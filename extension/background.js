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
        //sendPayloadToServer('http://localhost:8080/text', { text: info.selectionText });
        query({"question": "Hey, how are you?"}).then((response) => {
            console.log(response);
        });
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
        sendPayloadToServer('http://localhost:8080/image', { imageUrl: info.srcUrl });
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
// added
async function query(data) {
    const response = await fetch(
        "https://flowise.local/api/v1/prediction/31c8382a-0461-4d43-9214-8af5bebe83d2",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

//query({"question": "Hey, how are you?"}).then((response) => {
//    console.log(response);
//});
// addded

function sendPayloadToServer(endpoint, payload) {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => console.log("Payload successfully sent to the server:", data))
    .catch(error => console.error("Error sending payload to the server:", error));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendSelectedText') {
        sendPayloadToServer('http://localhost:8080/text', { text: request.text, prompt: request.prompt });
    } else if (request.action === 'sendImageUrl') {
        sendPayloadToServer('http://localhost:8080/image', { imageUrl: request.imageUrl, prompt: request.prompt });
    }
    sendResponse({ status: 'success' });
});
