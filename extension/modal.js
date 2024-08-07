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
    const copyButton = modal.querySelector('.llm-copy-button'); // Select the copy button
    const textArea = modal.querySelector('.llm-modal-text');

    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    copyButton.addEventListener('click', () => { // Add click event for the copy button
        navigator.clipboard.writeText(textArea.value).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

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
