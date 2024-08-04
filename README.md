# llmext

## Description

llmext is a Chrome extension that allows users to easily send selected text or image URLs to a backend server for processing. It provides context menu options for sending content directly from the browser and a user-friendly popup for adding custom prompts to enhance the processing of the selected content.

## Features

- **Context Menu**: Right-click context menu options to:
  - Process selected text
  - Process selected text with a custom prompt
  - Process images by URL
  - Process images by URL with a custom prompt
- **Popup Interface**: A popup interface for entering prompts when selected text or images are sent.
- **Customizable**: Easily modify the code to suit your specific needs, including changing the server endpoints or the behavior of the extension.

## Directory Structure

```
/llmext
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── prompt.html
│   ├── prompt.js
│   ├── styles.css
│   └── brain-circuit.png
├── test_server.py
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/danpicton/llmext.git
   cd llmext
   ```

2. Load the extension into Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` directory

3. Run the test server (if needed):
   ```bash
   python test_server.py
   ```

## Usage

1. Select text or an image in your browser.
2. Right-click to open the context menu and choose the appropriate option (e.g., "Process text").
3. If you're sending content with a prompt, a popup will open allowing you to enter your custom prompt.
4. Click "Send" to send the information to the server.

## Configuration

Modify the `config.js` file (not included in the provided files) to set your `textEndpoint` and `imgEndpoint` for the backend server.

## Development

- The extension uses Chrome's Manifest V3.
- The background service worker (`background.js`) manages the context menus and the communication with the backend server.
- The popup (`prompt.html` and `prompt.js`) is responsible for collecting any prompts from the user before sending the data.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- Icons provided by [lucide.dev] ([license](icon_license.md))


