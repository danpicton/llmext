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

        // Add event listeners for the preset buttons
        document.getElementById('btnAnki').addEventListener('click', () => {
            promptText.value = "Please create a set of flashcards. The cards should be in markdown bullet point format with the question on the top level bullet point, and the answer on a second level bullet point. The question should be suffixed with a #card hashtag. A question should have at least one answer (most should have only one answer) and no more than 3 answer bullet points. There should be no text provided other than the bullet points, questions and answers. Questions should seek to test the key facts from the text. Do not include any introductory/explanatory text please. Please use UK English. Provide no more than 5 questions.";
        });
        document.getElementById('btnELI5').addEventListener('click', () => {
            promptText.value = "Explain this like I'm 5";
        });
        document.getElementById('btnSummarise').addEventListener('click', () => {
            promptText.value = "Please summarise";
        });
        document.getElementById('btnStepByStep').addEventListener('click', () => {
            promptText.value = "Provide a step-by-step guide";
        });
    });
});
