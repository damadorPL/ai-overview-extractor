# AI Overview Extractor - Browser Extension

🔍 **Extract AI Overview content from Google Search to Markdown format**

Extension automatically detects AI Overview on Google results pages and enables exporting content along with sources to readable Markdown format.

- Chrome Extension: https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje
- Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/

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

## 📦 Installation

### Method 1: Chrome/Chromium - Developer Mode

1. **Download files** - copy all files to `ai-overview-extractor/` folder
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable** "Developer mode" (toggle in top right corner)
4. **Click** "Load unpacked extension"
5. **Select** `ai-overview-extractor/` folder
6. **Done!** Extension will be loaded

### Method 2: Firefox - Developer Mode

1. **Download files** - copy all files to `ai-overview-extractor/` folder
2. **Open Firefox** and navigate to `about:debugging`
3. **Click** "This Firefox" in left menu
4. **Click** "Load Temporary Add-on..."
5. **Select** `manifest.json` file from extension folder
6. **Done!** Extension will be loaded

### Method 3: Firefox - Permanent Installation

1. Go to `about:config` in Firefox
2. Find `xpinstall.signatures.required` and set to `false`
3. Pack extension folder to `.zip` file
4. Change extension to `.xpi`
5. Drag `.xpi` file to Firefox

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
https://example.com/webhook-endpoint
https://api.your-domain.com/receive-ai-data
http://localhost:5678/webhook/ai-overview-extractor  # n8n locally
```

## 🔗 n8n Integration

The extension is fully compatible with n8n and includes a ready-made template workflow for comprehensive automation!

### 🚀 Ready n8n Template

In the `workflows_templates/` folder you'll find ready workflow `AI_Overviews_Extractor_Plugin.json` which contains:

#### 📋 Workflow features:
1. **Webhook endpoint** - automatic data reception from extension
2. **HTML→Markdown processing** - content conversion
3. **Google Sheets saving** - automatic results storage
4. **AI Guidelines Generator** - LLM generates SEO guidelines based on AI Overview
5. **Automation** - scheduler every 15 minutes + manual trigger
6. **Page analysis** - fetching and analyzing content from URLs

#### 🛠️ Template installation:

1. **In n8n go to:** `Templates` → `Import from JSON`
2. **Load file:** `workflows_templates/AI_Overviews_Extractor_Plugin.json`
3. **Configure nodes:**
   - Google Sheets (OAuth connection)
   - OpenRouter Chat Model (API key)
   - Set Google Sheets URL in nodes
4. **Activate workflow**
5. **Copy webhook URL** (from Webhook node)

#### ⚙️ Extension configuration:

1. **Webhook URL:** `http://localhost:5678/webhook/ai-overview-extractor`
2. **Test connection** - should return status 200
3. **Save configuration**

#### 📊 What the workflow does:

- **Receives data** from extension (keyword, markdown, HTML, sources)
- **Saves to sheet** all AI Overview data
- **Analyzes pages** from Google Sheets (`myURL` column)
- **Generates SEO guidelines** using AI (compares page content with AI Overview)
- **Updates sheet** with generated guidelines
- **Automatic execution** every 15 minutes for new tasks

#### 🎯 Benefits:

- **Full automation** - from extraction to analysis
- **Knowledge base** - all AI Overviews in one place  
- **SEO insights** - AI guidelines on what to add to page
- **Scalability** - batch processing of multiple URLs
- **Monitoring** - tracking changes in AI Overview

### 🔧 n8n Requirements:

- **n8n v1.95.3+** (locally or in cloud)
- **Google Sheets API** (for data saving)
- **OpenRouter API** (for AI guidelines) or other LLM provider
- **Webhook endpoint** active on port 5678

## 📁 File Structure

```
ai-overview-extractor/
├── manifest.json      # Extension configuration (Manifest V3)
├── styles.css         # User interface styles
├── README.md          # This documentation
├── LICENCE            # MIT License
├── .gitignore         # Files ignored by Git
├── AI_SUMMARY.md      # 🤖 CRITICAL: Technical documentation for AI/LLM systems - main project overview
├── src/              # Source files
│   ├── content.js                  # Main script with AIOverviewExtractor class
│   ├── settings-manager.js         # Extension settings management
│   ├── auto-expander-overviews.js  # Automatic AI overview expansion
│   ├── auto-expander-sources.js    # Automatic source list expansion
│   ├── auto-webhook.js             # Automatic webhook dispatch
│   ├── extraction-orchestrator.js  # Manual extraction coordination
│   ├── content-extractor.js        # Content and source extraction
│   ├── markdown-generator.js       # Markdown conversion
│   ├── ui-manager.js               # In-page UI management
│   ├── popup.js                    # Extension popup management
│   ├── popup.html                  # Popup interface structure
│   ├── popup.css                   # Popup interface styling
│   ├── webhook-manager.js          # Webhook management and POST requests
│   ├── turndown.js                 # HTML→Markdown conversion library
│   └── README.md                   # Source code documentation
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
│   ├── AI_Overviews_Extractor_Plugin.json  # Comprehensive n8n workflow
│   └── README.md                            # Workflow documentation
├── n8n-template-submission/  # n8n Template Store submission files
│   ├── AI_Overviews_Extractor_Plugin.json  # Template workflow file
│   ├── README.md                            # Template description
│   ├── setup-instructions.md               # Installation instructions
│   ├── template-description.md             # Detailed template description
│   └── template-name.txt                   # Template name
└── docs/             # Publication and legal documentation
    ├── chrome-web-store-description.md         # Chrome Web Store description
    ├── chrome-web-store-privacy-justifications.md # Chrome privacy justifications
    ├── chrome-web-store-permission-justifications.md # Chrome permission justifications
    ├── chrome-web-store-appeal-response.md     # Chrome Store rejection response
    ├── firefox-release-notes.md                # Firefox Add-ons release notes
    ├── firefox-reviewer-notes.md               # Firefox reviewer notes
    └── privacy-policy.md                       # Privacy policy
```

## ⚙️ Requirements

- **Chrome/Chromium** (latest version) or **Firefox** 58+ (Firefox Quantum)
- **Manifest V3** - modern extension standard
- **Page**: `google.com/search`
- **Language**: Works with Google interface in any language
- **Permissions**: `storage`, `host_permissions: *://www.google.com/*`

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

### v1.0.7 (current)
- 🐛 **Fixed auto-webhook functionality** - Fixed automatic webhook sending after AI overview expansion
- 🔍 **Improved AI Overview detection** - Enhanced detection of asynchronously loaded AI overviews
- 🔧 **Conservative defaults** - Auto-expansion features now disabled by default for better user control
- 📊 **Enhanced logging** - Added comprehensive debugging logs for troubleshooting
- ⏱️ **Timing improvements** - Added delayed checks to catch AI overviews that load with delay
- 🏗️ **Technical fixes** - Fixed ContentExtractor integration and improved error handling
- 🛡️ **Better reliability** - Extension now consistently detects AI overviews regardless of load timing

## 🚀 Features (updated)
- 🚀 **Webhooks** - automatic sending of data to external APIs after AI Overview and sources expansion
- 🔄 **Auto-expander improvements** - fixed blinking by clicking expand buttons only once
- ⚙️ **Settings** - auto-expansion features disabled by default for better user control

### v1.0.6
- ✨ **Auto-expand AI overviews** - Automatically clicks "Show more" button on collapsed AI overviews
- 🔗 **Auto-expand sources** - Automatically expands collapsed source sections
- 🚀 **Auto-webhook functionality** - Automatically sends extracted data to configured endpoints
- ⚙️ **Settings management** - Persistent storage with Chrome storage API
- 🎨 **Extension popup interface** - Modern settings panel accessible from browser toolbar
- 🔄 **Real-time synchronization** - Changes applied immediately across all tabs

### v1.0.5
- 🔧 **Chrome Web Store compliance** - removed unnecessary `activeTab` permission
- 📝 **Documentation update** - updated all permission justifications and descriptions
- ✅ **Verification** - confirmed extension works with minimal permissions only
- 🏪 **Store ready** - prepared for Chrome Web Store resubmission

### v1.0.4
- 🌍 **English translation** - complete interface and documentation translation
- 🎨 **UI improvements** - updated button text and user messages
- 📝 **Documentation** - fully translated README and user guides
- � **Code cleanup** - improved console messages and comments

### v1.0.3
- 🚀 **NEW: Webhooks** - automatic data sending to external APIs
- ⚙️ **Webhook configuration** - UI for URL setup and testing
- 🧹 **Improved cleaning** - removal of CSS, JavaScript and inline styles
- �💾 **Chrome Storage** - secure configuration storage
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
