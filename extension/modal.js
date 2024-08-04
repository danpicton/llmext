// modal.js
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'llm-modal show'; // Add the show class to display the modal
    modal.innerHTML = `
        <div class="llm-modal-content">
            <span class="llm-close-button">&times;</span>
            <div class="llm-modal-text">Here is some content<br>${content}</div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.llm-close-button');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showModal') {
        createModal(request.content);
    }
});