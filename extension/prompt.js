document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["selectedText", "type"], (data) => {
        const promptText = document.getElementById('promptText');
        promptText.focus();

        const sendButton = document.getElementById('sendButton');
        sendButton.addEventListener('click', () => {
            const userPrompt = promptText.value;

            if (data.type === "text") {
                chrome.runtime.sendMessage({
                    action: 'sendSelectedText',
                    text: data.selectedText,
                    prompt: userPrompt
                }, response => {
                    if (response.status === 'success') {
                        window.close();
                    }
                });
            } else if (data.type === "image") {
                chrome.runtime.sendMessage({
                    action: 'sendImageUrl',
                    imageUrl: data.selectedText,
                    prompt: userPrompt
                }, response => {
                    if (response.status === 'success') {
                        window.close();
                    }
                });
            }
        });
    });
});