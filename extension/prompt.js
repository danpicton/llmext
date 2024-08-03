document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["selectedText", "type"], ({selectedText, type}) => {
        const promptText = document.getElementById('promptText');
        const sendButton = document.getElementById('sendButton');

        // Focus the prompt text area when the popup opens
        promptText.focus();

        // Function to handle the send action
        const handleSend = () => {
            const userPrompt = promptText.value;
            const message = {
                action: type === 'text' ? 'sendSelectedText' : 'sendImageUrl',
                [type === 'text' ? 'text' : 'imageUrl']: selectedText,
                prompt: userPrompt
            };

            chrome.runtime.sendMessage(message, response => {
                if (response.status === 'success') {
                    window.close();
                }
            });
        };

        // Add click event listener to the send button
        sendButton.addEventListener('click', handleSend);

        // Add keydown event listener for Ctrl+Enter
        promptText.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                handleSend();
            }
        });
    });
});
