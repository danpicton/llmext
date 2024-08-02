document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text');
    const imageUrl = urlParams.get('imageUrl');

    const selectedItem = document.getElementById('selectedItem');
    if (text) {
        selectedItem.textContent = `Selected Text: ${text}`;
    }
    if (imageUrl) {
        selectedItem.textContent = `Image URL: ${imageUrl}`;
    }

    const promptText = document.getElementById('promptText');
    promptText.focus();

    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        const userPrompt = promptText.value;
        
        if (text) {
            chrome.runtime.sendMessage({ 
                action: 'sendSelectedText', 
                text: text, 
                prompt: userPrompt 
            }, response => {
                if (response.status === 'success') {
                    window.close();
                }
            });
        }
        
        if (imageUrl) {
            chrome.runtime.sendMessage({ 
                action: 'sendImageUrl', 
                imageUrl: imageUrl, 
                prompt: userPrompt 
            }, response => {
                if (response.status === 'success') {
                    window.close();
                }
            });
        }
    });
});
