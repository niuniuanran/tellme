# Tell Me

A Chrome extension that lets you ask questions about selected text using AI. Right-click on any text to get instant explanations or ask custom questions.

![](./screenshot.png)

## Features

- **Tell me...**: Opens a prompt where you can ask custom questions about selected text
- **summarize paragraph**: Instantly summarizes selected text

## Prerequisites

- **Node.js** (version 14 or higher)
- **Python 3.8+**
- **OpenAI API key**
- **Chrome/Edge browser**

## Setup Instructions

### 1. Build the Extension

```sh
cd extension
npm install
npm run build
```

### 2. Install in Browser

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/dist` folder

### 3. Setup Backend

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

Install Python dependencies:

```sh
pip install pydantic fastapi[standard] openai python-dotenv
```

Or if `pip` not available

```sh
python3 -m pip install pydantic fastapi[standard] openai python-dotenv
```

Start the backend server:

```sh
python3 -m fastapi dev backend.py
```

The server will run on `http://localhost:8000`

## How to Use

1. **Select text** on any webpage
2. **Right-click** to open context menu
3. Choose either:
   - **"Tell me..."** - Opens side panel with input prompt for custom questions
   - **"summarize paragraph"** - Instantly processes with default question

## File Structure

```
tellme/
├── extension/          # Chrome extension source
│   ├── background.js   # Context menu and side panel logic
│   ├── sidepanel/      # Side panel UI and API calls
│   └── manifest.json   # Extension configuration
├── backend.py          # FastAPI server with OpenAI integration
├── README.md           # This file
└── screenshot.png      # Demo screenshot
```

## Development

To modify the extension:

1. Make changes to files in `extension/`
2. Run `npm run build` to rebuild
3. Reload the extension in Chrome extensions page
4. Test your changes

To modify the backend:

Make changes to `backend.py` and your updates should be applied to local dev server right away.

## Troubleshooting

**Extension not working:**
- Make sure backend is running on `http://localhost:8000`
- Check that OpenAI API key is set correctly
- Reload the extension after code changes

**Side panel not opening:**
- Ensure you're right-clicking on selected text
- Check Chrome's extension permissions
- Try reloading the page

**API errors:**
- Verify your OpenAI API key has credits
- Check console for error messages
- Ensure backend server is accessible