function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'llm-modal show'; // Show the modal
    let imgCloseModal = chrome.runtime.getURL('x.png');
    modal.innerHTML = `
        <div class="llm-modal-content">
            <img class="llm-close-button" src="${imgCloseModal}" alt="Close button" />
            <textarea class="llm-modal-text">${content}</textarea>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.llm-close-button');
    const textArea = modal.querySelector('.llm-modal-text');

    closeButton.addEventListener('click', () => {
        modal.remove();
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