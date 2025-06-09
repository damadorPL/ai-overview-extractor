# AI Overview Extractor - Browser Extension

🔍 **Extract AI Overview content from Google Search to Markdown format**

Extension automatically detects AI Overview on Google results pages and enables exporting content along with sources to readable Markdown format.

Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/

![Extension demo](./images/ai-overviews-extractor.gif)


## 🚀 Features

- ✅ **Automatic detection** of AI Overview on Google Search (`#m-x-content` container)
- 📋 **Content extraction** to Markdown format using TurndownService library
- 🧹 **Advanced cleaning** - removes MSC elements, CSS, JavaScript and hidden elements
- 🔍 **Automatic extraction** of search keyword from query
- 🔗 **Source extraction** with cleaned Google URLs
- 💾 **Copy** to clipboard with one click
- 📥 **Download** as .md file with timestamp
- 🚀 **Webhooks** - automatic sending of data to external APIs
- ⚙️ **Webhook configuration** - easy URL setup and connection testing
- 🎨 **Clean interface** with preview and notifications
- 🔄 **DOM Observer** - automatic button addition for new results

## 🎯 Usage

### Basic extraction
1. **Search** for something on Google (e.g. "diabetes")
2. **Wait** for AI Overview to appear
3. **Click** "Show more" button
4. **Click** "Show all"
5. **Click** "📋 Extract to Markdown" button
6. **Copy** content or download as file

### Webhook configuration
1. **Click** "📋 Extract to Markdown" button
2. **In "🔗 Webhook Configuration" section** enter your API URL
3. **Test connection** with "🧪 Test" button
4. **Save configuration** with "💾 Save" button
5. **Send data** with "🚀 Send webhook" button

### Example webhook URLs
```
https://your-api.com/ai-overview-webhook
https://zapier.com/hooks/catch/123456/abcdef
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

## 📁 File Structure

```
ai-overview-extractor/
├── manifest.json      # Extension configuration (Manifest V3)
├── styles.css         # User interface styles
├── README.md          # This documentation
├── LICENCE            # MIT License
├── .gitignore         # Files ignored by Git
├── AI_SUMMARY.md      # Technical documentation for AI/LLM
├── src/              # Source files
│   ├── content.js        # Main script with AIOverviewExtractor class
│   ├── webhook-manager.js # Webhook management and POST requests
│   └── turndown.js       # HTML→Markdown conversion library
├── icons/            # Extension icons
│   ├── icon-16.png
│   ├── icon-32.png  
│   ├── icon-48.png
│   ├── icon-96.png
│   └── icon-128.png
├── images/           # Documentation images
│   ├── ai-overviews-extractor.gif
│   ├── ai-overview-extractor-001.jpg
│   └── ai_overviews_extractor_logo.png
├── workflows_templates/  # Ready n8n workflow template
│   └── AI_Overviews_Extractor_Plugin.json  # Comprehensive n8n workflow
└── docs/             # Additional documentation
    ├── chrome-web-store-description.md
    ├── chrome-web-store-privacy-justifications.md
    └── privacy-policy.md
```

## ⚙️ Requirements

- **Chrome/Chromium** (latest version) or **Firefox** 58+ (Firefox Quantum)
- **Manifest V3** - modern extension standard
- **Page**: `google.com/search`
- **Language**: Works with Google interface in any language
- **Permissions**: `activeTab`, `host_permissions: *://www.google.com/*`

## 🔧 Configuration

Extension works automatically on:
- `*://www.google.com/search*`

To add other Google domains, edit `content_scripts.matches` section in `manifest.json`:

```json
"content_scripts": [
  {
    "matches": [
      "*://www.google.com/search*",
      "*://www.google.pl/search*",
      "*://www.google.de/search*"
    ],
    "js": ["src/turndown.js", "src/content.js"],
    "css": ["styles.css"],
    "run_at": "document_end"
  }
]
```

## 🔍 How it works

### AI Overview Detection
- Looks for `#m-x-content` container on page
- Uses `MutationObserver` to monitor DOM changes
- Automatically adds button when container is found

### Content Extraction
- Removes elements with `data-subtree="msc"` (MSC elements)
- Removes elements with `style="display:none"` (hidden elements)
- Removes sources container before conversion
- Converts HTML to Markdown using TurndownService

### Source Extraction
- Finds sources container `div[style="height: 100%;"]`
- Extracts links from visible list `ul[class]`
- Cleans Google URLs (removes `/url?` wrappers)
- Filters duplicates and invalid links

### Webhooks (NEW!)
- **Automatic sending** of data to external APIs via POST method
- **UI configuration** - easy webhook URL setup
- **Connection testing** - check if webhook works
- **Secure storage** - URL saved in chrome.storage
- **Complete payload** - keyword, markdown, HTML and sources
- **Error handling** - 5s timeout and informative messages

#### Webhook data format:
```json
{
  "timestamp": "2025-01-06T12:30:00Z",
  "searchQuery": "search keyword",
  "aiOverview": {
    "content": "markdown content",
    "htmlContent": "cleaned HTML"
  },
  "sources": [
    {"title": "Title", "url": "https://url.com"}
  ],
  "metadata": {
    "googleSearchUrl": "https://google.com/search?q=...",
    "extractedAt": "2025-01-06T12:30:00Z",
    "userAgent": "Mozilla/5.0...",
    "extensionVersion": "1.0.4"
  }
}
```

## 🐛 Troubleshooting

### Button doesn't appear
- Check if AI Overview is actually on the page
- Open console (F12) and look for `[AI Overview Extractor]` logs
- Check if `#m-x-content` element exists
- Refresh page and wait for full loading

### No content in markdown
- AI Overview may not be fully loaded
- Try again after a few seconds
- Check console logs - they should show extraction process
- Check for JavaScript errors

### Copy error
- Check if browser has clipboard permissions
- Try downloading file instead of copying
- Check if page is served over HTTPS

### Source issues
- Check console logs about found links
- Some sources may be filtered (Google, support etc.)
- URLs are automatically cleaned from Google wrappers

## 🔄 Updates

To update the extension:

**Chrome/Chromium:**
1. Download new files
2. Replace old files in extension folder
3. Go to `chrome://extensions/`
4. Click "Reload" on the extension

**Firefox:**
1. Download new files
2. Replace old files in extension folder
3. Go to `about:debugging`
4. Click "Reload" on the extension

## 📝 Changelog

### v1.0.4 (current)
- 🌍 **English translation** - complete interface and documentation translation
- 🎨 **UI improvements** - updated button text and user messages
- 📝 **Documentation** - fully translated README and user guides
- 🔧 **Code cleanup** - improved console messages and comments

### v1.0.3
- 🚀 **NEW: Webhooks** - automatic data sending to external APIs
- ⚙️ **Webhook configuration** - UI for URL setup and testing
- 🧹 **Improved cleaning** - removal of CSS, JavaScript and inline styles
- 💾 **Chrome Storage** - secure configuration storage
- 🔒 **HTTPS validation** - webhook security
- ⏱️ **Timeout handling** - error handling and timeouts (5s)

### v1.0.2
- 🔧 Stability and compatibility fixes
- 📱 Manifest V3 support
- 🌐 Chrome and Firefox compatibility

### v1.0.1
- 🐛 Source extraction bug fixes
- ⚡ Performance optimizations
- 🔍 Improved AI Overview detection

### v1.0.0
- ✨ First version
- 📋 AI Overview extraction to Markdown with TurndownService
- 🔗 Source extraction with Google URL cleaning
- 🧹 Advanced content filtering (MSC, hidden elements)
- 💾 Copy and download with timestamp
- 🎨 User interface with notifications
- 🔄 DOM observer for dynamic changes

## 🤝 Contributing

Project is open source! You can:
- 🐛 **Report bugs** via Issues on GitHub
- 💡 **Suggest features** 
- 🔧 **Send Pull Requests**
- ⭐ **Star** if you like the project

**GitHub:** https://github.com/romek-rozen/ai-overview-extractor

## 👨‍💻 Author

**Roman Rozenberger**
- GitHub: https://github.com/romek-rozen
- Website: https://rozenberger.com

## 📄 License

MIT License - you can use, modify and distribute for free.

---

**Useful? Leave a ⭐ and share with others!**

Created with ❤️ for SEO and digital marketing community.
