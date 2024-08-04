const styles = `
.llm-modal {
    position: fixed !important; /* Use fixed position to overlay entire viewport */
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; /* Center the modal */
    margin: 0 !important;
    padding: 10px !important;
    background: white !important;
    z-index: 999999999 !important;
    max-width: 800px !important;
    min-width: 340px !important;
    display: none;
}

.llm-modal.show {
    display: block; /* Change to block to display the modal */
}

.llm-modal-content {
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: 20px;
    border: 1px solid var(--border-color);
    width: 100%; /* Full width within modal container */
    max-width: 100%; /* Ensure it does not exceed the parent modal width */
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative; /* Ensure content is positioned relative to modal container */
}

.llm-close-button {
    color: var(--text-color);
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.llm-modal-text {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
}
`;

// Create a <style> element, and append the styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

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