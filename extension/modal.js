function createModal(content) {
    // Check if a modal already exists
    if (document.querySelector('.llm-modal')) {
        return; // Exit if a modal is already present
    }
  
    const modal = document.createElement('div');
    modal.className = 'llm-modal show'; // Show the modal
    let imgCloseModal = chrome.runtime.getURL('x.png');
    let imgCopyToClipboard = chrome.runtime.getURL('clipboard-copy.png'); // Add reference to clipboard icon
    modal.innerHTML = `
        <div class="llm-modal-content">
            <div class="llm-modal-buttons">
                <img class="llm-copy-button" src="${imgCopyToClipboard}" alt="Copy to clipboard" />
                <img class="llm-close-button" src="${imgCloseModal}" alt="Close button" />
            </div>
            <textarea class="llm-modal-text">${content}</textarea>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.llm-close-button');
    const copyButton = modal.querySelector('.llm-copy-button');
    const textArea = modal.querySelector('.llm-modal-text');

    function closeModal() {
        modal.remove();
        // Remove the keydown event listener when the modal is closed
        document.removeEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    closeButton.addEventListener('click', closeModal);

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(textArea.value).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Add keydown event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Copy content to clipboard when the modal is shown
    navigator.clipboard.writeText(content).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showModal') {
        createModal(request.content);
    }
});
