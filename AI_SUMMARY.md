# AI Overview Extractor - Technical Documentation for AI/LLM Systems

## 🎯 **Extension Purpose**
Chrome/Firefox extension that extracts **AI Overview** content from Google Search and converts to **Markdown** with ability to send to **webhooks** via POST requests.

## 📁 **File Architecture**
```
ai-overview-extractor/
├── manifest.json              # Manifest V3, permissions: storage
├── styles.css                 # UI styles (modal, buttons, notifications)
├── README.md                  # Main documentation (English)
├── LICENCE                    # MIT License
├── .gitignore                 # Git ignored files
├── AI_SUMMARY.md              # 🤖 CRITICAL: Technical docs for AI/LLM systems
├── CHANGELOG.md               # Version history and changes
├── src/                       # Source files (Modular Architecture)
│   ├── content.js             # Main AIOverviewExtractor orchestrator
│   ├── settings-manager.js    # Extension settings management
│   ├── auto-expander-overviews.js # Automatic AI overview expansion
│   ├── auto-expander-sources.js   # Automatic source list expansion
│   ├── auto-webhook.js        # Automatic webhook dispatch
│   ├── extraction-orchestrator.js # Manual extraction coordination
│   ├── content-extractor.js   # Content and source extraction
│   ├── markdown-generator.js  # Markdown conversion
│   ├── ui-manager.js          # In-page UI management
│   ├── popup.js               # Extension popup management
│   ├── popup.html             # Popup interface structure
│   ├── popup.css              # Popup interface styling
│   ├── webhook-manager.js     # WebhookManager class (POST requests)
│   ├── turndown.js            # HTML→Markdown conversion library
│   └── README.md              # Source code documentation (47 pages)
├── icons/                     # Extension icons (16-128px)
├── images/                    # Documentation images
│   ├── ai-overviews-extractor.gif
│   ├── ai-overview-extractor-001.jpg
│   └── ai_overviews_extractor_logo.png
├── workflows_templates/       # Ready n8n workflow templates
│   ├── AI_Overviews_Extractor_Plugin.json
│   └── README.md
├── n8n-template-submission/   # n8n Template Store submission files
│   ├── AI_Overviews_Extractor_Plugin.json
│   ├── README.md
│   ├── setup-instructions.md
│   ├── template-description.md
│   └── template-name.txt
└── docs/                      # Publication and legal documentation
    ├── chrome-web-store-description.md
    ├── chrome-web-store-privacy-justifications.md
    ├── firefox-release-notes.md
    └── privacy-policy.md
```

## 🏗️ **Modular Architecture** (v1.0.7)

### **Extension Core**
- **`content.js`** - Main orchestrator (`AIOverviewExtractor`)
- **`settings-manager.js`** - Settings persistence (`SettingsManager`)

### **Automation Control**
- **`automation-state-machine.js`** - State machine for predictable automation flow (`AutomationStateMachine`)
- **`automation-circuit-breaker.js`** - Circuit breaker protection against failures (`AutomationCircuitBreaker`)
- **`container-detection-manager.js`** - Unified container detection system (`ContainerDetectionManager`)

### **Auto-Expansion Layer**
- **`auto-expander-overviews.js`** - AI Overview expansion (`AutoExpanderOverviews`)
- **`auto-expander-sources.js`** - Source list expansion (`AutoExpanderSources`) 
- **`auto-webhook.js`** - Automatic webhook dispatch (`AutoWebhook`)

### **Extraction System**
- **`extraction-orchestrator.js`** - Manual extraction coordination (`ExtractionOrchestrator`)
- **`content-extractor.js`** - Content extraction (`ContentExtractor`)
- **`markdown-generator.js`** - Markdown conversion (`MarkdownGenerator`)

### **User Interface**
- **`popup.js/.html/.css`** - Extension popup interface (`PopupManager`)
- **`ui-manager.js`** - In-page UI management (`UIManager`)

### **Utilities**
- **`webhook-manager.js`** - HTTP webhook handling (`WebhookManager`)
- **`turndown.js`** - HTML→Markdown library

## 🎯 **Main Classes**

### **AIOverviewExtractor** (`src/content.js`) - ORCHESTRATOR
```javascript
class AIOverviewExtractor {
    constructor() {
        this.settingsManager = new SettingsManager();
        this.webhookManager = new WebhookManager();
        this.autoExpanderOverviews = new AutoExpanderOverviews();
        this.autoExpanderSources = new AutoExpanderSources();
        this.autoWebhook = new AutoWebhook();
        this.extractionOrchestrator = new ExtractionOrchestrator();
        this.init();
    }
    
    // Key methods:
    async init()                        // Initialize all modules
    setupModuleCallbacks()              // Wire module communication
    async orchestrateModules()          // Auto-expansion workflow
    observeDOM()                        // MutationObserver setup
    checkAndAddButton()                 // Manual extraction button
    addButton(container)                // Button injection
}
```

### **SettingsManager** (`src/settings-manager.js`)
```javascript
class SettingsManager {
    defaultSettings = {
        autoExpandOverviews: true,      // Auto-expand AI overviews
        autoExpandSources: true,        // Auto-expand source lists
        autoSendWebhook: false          // Auto-send webhook data
    }
    
    // Key methods:
    async getSettings()                 // Get all settings
    async saveSettings(settings)       // Save all settings
    async saveSetting(key, value)       // Save single setting
    async resetToDefaults()             // Reset to defaults
    validateSettings(settings)          // Validate structure
}
```

### **AutoExpanderOverviews** (`src/auto-expander-overviews.js`)
```javascript
class AutoExpanderOverviews {
    // Key methods:
    async expandAIOverview()            // Main expansion logic
    async waitForExpansion()            // Animation completion wait
    isExpanded()                        // Check expansion state
    isPresent()                         // Check if AI overview exists
    onExpansionComplete(callback)       // Register callback
}
```

### **AutoExpanderSources** (`src/auto-expander-sources.js`)
```javascript
class AutoExpanderSources {
    // Key methods:
    async expandSources()               // Main expansion logic
    async universalExpandSources()      // Universal click strategy
    areSourcesExpanded()                // Check expansion state
    areSourcesPresent()                 // Check if sources exist
    setReady()                          // Signal readiness
}
```

### **AutoWebhook** (`src/auto-webhook.js`)
```javascript
class AutoWebhook {
    // Key methods:
    async autoSendWebhook()             // Main webhook logic
    async prepareWebhookData(container) // Data preparation
    async waitForReady()                // Wait for expansion signals
    showNotification(message)           // User feedback
    setReady()                          // Signal readiness
}
```

### **WebhookManager** (`src/webhook-manager.js`)
```javascript
class WebhookManager {
    // Key methods:
    saveWebhookUrl(url)                 // Saves URL in chrome.storage
    getWebhookUrl()                     // Gets URL from storage
    testWebhook(url)                    // Tests POST with test payload
    sendToWebhook(data)                 // Sends data POST to webhook
    makeRequest(url, payload)           // fetch() with 5s timeout
    isValidWebhookUrl(url)              // URL validation
    createPayload(data)                 // Format data for sending
}
```

### **PopupManager** (`src/popup.js`)
```javascript
class PopupManager {
    // Key methods:
    async init()                        // Initialize popup
    async loadSettings()                // Load and display settings
    updateUI(settings)                  // Update toggle states
    async handleSettingChange(key, value) // Process setting changes
    async notifyContentScripts(key, value) // Sync with content scripts
    showStatus(icon, text, type)        // Show status messages
}
```

## 📡 **Webhook API**

### **POST Request**
```javascript
POST https://your-webhook.com/endpoint
Content-Type: application/json
```

### **Payload Structure**
```json
{
  "timestamp": "2025-01-06T12:30:00Z",
  "searchQuery": "search keyword",
  "aiOverview": {
    "content": "markdown without CSS/JS",
    "htmlContent": "cleaned HTML"
  },
  "sources": [
    {
      "title": "Source title",
      "url": "https://clean-url.com"
    }
  ],
  "metadata": {
    "googleSearchUrl": "https://google.com/search?q=...",
    "extractedAt": "2025-01-06T12:30:00Z",
    "userAgent": "Mozilla/5.0...",
    "extensionVersion": "1.0.7"
  }
}
```

## 🧩 **Key DOM Selectors**
- **AI Overview container:** `#m-x-content`
- **MSC elements (to remove):** `div[data-subtree="msc"]`
- **Sources section:** `div[style="height: 100%;"]`
- **Sources list:** `ul[class]` (first in sources container)
- **Hidden elements:** `[style*="display:none"]`

## 🧹 **Content Cleaning** (`extractContent()`)

### **Removed elements:**
- `<style>` and `<script>` tags
- Attributes: `style`, `class`, `data-ved`, `jscontroller`
- Inline JavaScript: `(function(){...})()`, `onclick=`
- JS fragments: variables, functions

### **Regex patterns:**
```javascript
cleanHTML.replace(/\(function\(\)[^}]*\{[^}]*\}\)\(\);?/g, '');
cleanHTML.replace(/on\w+\s*=\s*["'][^"']*["']/g, '');
cleanHTML.replace(/var\s+\w+\s*=\s*[^;]*;/g, '');
```

## 🎨 **UI Components**

### **Modal structure:**
```
.ai-extractor-overlay
└── .ai-extractor-modal
    ├── .ai-extractor-header (title + ❌ close)
    ├── .ai-extractor-textarea (markdown preview)
    ├── .ai-extractor-webhook-section (URL configuration)
    └── .ai-extractor-footer (📋 copy, 💾 download, 🚀 webhook)
```

### **Webhook configuration UI:**
- **URL Input:** `<input type="url" class="ai-extractor-webhook-input">`
- **Test:** `🧪 Test` - calls `testWebhook()`
- **Save:** `💾 Save` - calls `saveWebhookUrl()`
- **Status:** Dynamic configuration status message

### **UI Text (v1.0.4 - English):**
- Main button: `"📋 Extract to Markdown"`
- Modal buttons: `"📋 Copy"`, `"💾 Download"`, `"🚀 Send webhook"`
- Webhook section: `"🔗 Webhook Configuration"`
- Status messages: `"✅ Webhook configured"`, `"⚠️ Webhook not configured"`
- Notifications: `"✅ Copied to clipboard!"`, `"✅ Data sent to webhook!"`

## ⚙️ **Configuration**

### **Manifest.json key sections:**
```json
{
  "manifest_version": 3,
  "version": "1.0.7",
  "name": "AI Overview Extractor - Features",
  "permissions": ["storage"],
  "host_permissions": ["*://www.google.com/*"],
  "content_scripts": [{
    "matches": ["*://www.google.com/search*"],
    "js": [
      "src/turndown.js",
      "src/settings-manager.js",
      "src/webhook-manager.js",
      "src/auto-expander-overviews.js",
      "src/auto-expander-sources.js",
      "src/auto-webhook.js",
      "src/content-extractor.js",
      "src/markdown-generator.js",
      "src/ui-manager.js",
      "src/extraction-orchestrator.js",
      "src/content.js"
    ],
    "css": ["styles.css"]
  }],
  "action": {
    "default_popup": "src/popup.html"
  }
}
```

### **Storage keys:**
- `ai-overview-webhook-url` - Webhook URL (string)
- `ai-overview-settings` - Extension settings (object)

## 🔄 **Execution Flow**
1. **DOM Observer** - detects `#m-x-content`
2. **Add button** - "📋 Extract to Markdown"
3. **Click** → `extractContent()` + `extractSources()`
4. **Conversion** → `createMarkdown()` via TurndownService
5. **Modal** → `showPreview()` with webhook UI
6. **Webhook** → `handleWebhookSend()` → POST request

## 🛡️ **Security**
- **HTTPS only** - webhook URL validation
- **5s timeout** - AbortController in fetch()
- **Sanitization** - removing JS/CSS from content
- **Error handling** - try/catch with messages

## 📝 **Code Usage Example**
```javascript
// Initialization
const extractor = new AIOverviewExtractor();

// Manual webhook
const data = {
  searchQuery: "test",
  content: "markdown",
  htmlContent: "<p>html</p>",
  sources: [{title: "Test", url: "https://test.com"}]
};
await extractor.webhookManager.sendToWebhook(data);
```

## 🔗 **n8n Integration** (FEATURED!)

### **Template workflow** (`workflows_templates/AI_Overviews_Extractor_Plugin.json`)
Complete n8n workflow for AI Overview automation:

#### **Workflow architecture:**
```
Webhook → Data Processing → Google Sheets → AI Analysis → SEO Guidelines
```

#### **Main nodes:**
1. **Webhook** - endpoint `/ai-overview-extractor` (port 5678)
2. **data** (Set) - payload extraction: `searchQuery`, `htmlContent`, `sources`
3. **Markdown** - HTML→Markdown conversion
4. **updateRows** (Google Sheets) - AI Overview storage
5. **Basic LLM Chain** - AI generates SEO guidelines
6. **Schedule Trigger** - automation every 15 minutes

#### **Payload mapping:**
```javascript
// From webhook to Google Sheets:
{
  key: `${searchQuery} ${extractedAt}`,
  extractedAt: timestamp,
  searchQuery: query,
  sources: formatted_sources,
  markdown: converted_content
}
```

#### **AI Prompt (SEO guidelines):**
```
System: "Alice analyzes AI Overview vs page content"
Input: searchQuery + htmlContent + aiOverview
Output: "What to add to page to appear in AI Overview"
```

#### **Google Sheets structure:**
```
extractedAt | searchQuery | sources | markdown | myURL | task | guidelines | key | row_number
```

#### **Automation flows:**
1. **Webhook flow:** Plugin → n8n → Google Sheets (immediate)
2. **Batch flow:** Google Sheets → Page Analysis → AI Guidelines (every 15min)
3. **Filtering:** Only records with `task="create guidelines"` and `myURL`

#### **Webhook configuration in plugin:**
```javascript
webhookUrl: "http://localhost:5678/webhook/ai-overview-extractor"
testPayload: { test: true, timestamp: ISO_string, message: "Test..." }
```

## 🌍 **Distribution & Installation**

### **Official Firefox Add-on:**
- **URL:** https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/
- **Auto-updates:** Yes (when installed from Mozilla Add-ons)
- **Developer ID:** `ai-overview-extractor@rozenberger.com`

### **GitHub Repository:**
- **URL:** https://github.com/romek-rozen/ai-overview-extractor
- **Installation:** Clone for developer mode
- **Documentation:** Complete setup instructions

### **Chrome Web Store:**
- **Status:** Under review
- **Auto-updates:** Yes (when approved)

### **n8n Template Store:**
- **Submission:** Ready (`n8n-template-submission/` folder)
- **Template:** Complete workflow with setup instructions
- **Integration:** Seamless with extension webhook functionality

## 🚀 **Version History**
- **v1.0.7** - Current: Removed auto-extract functionality, modular architecture, complete documentation
- **v1.0.6** - Auto-expand AI overviews, auto-expand sources, auto-webhook, settings system
- **v1.0.5** - Chrome Web Store compliance fix - removed activeTab permission
- **v1.0.4** - Complete English UI translation, documentation updates
- **v1.0.3** - Webhooks + n8n template integration
- **v1.0.2** - Stability fixes, Manifest V3 support
- **v1.0.1** - Source extraction improvements, performance optimization
- **v1.0.0** - Initial release with core functionality

## 🔧 **Technical Specifications**
- **Manifest V3** - Modern extension standard
- **Cross-browser** - Chrome + Firefox support
- **Dependencies:** TurndownService (HTML→Markdown)
- **Storage:** Chrome Storage API for webhook URLs
- **Permissions:** `storage`, `*://www.google.com/*`
- **Architecture:** Class-based, modular design
- **Error handling:** Comprehensive try/catch with user feedback

## 🎯 **Use Cases**
1. **SEO Research** - Extract AI Overview content for competitive analysis
2. **Content Strategy** - Understand what appears in AI Overview
3. **n8n Automation** - Automated workflow processing with Google Sheets
4. **API Integration** - Webhook connectivity for custom workflows
5. **Documentation** - Markdown export for knowledge management

## 🔄 **Integration Points**
- **n8n workflows** - Direct webhook integration
- **Google Sheets** - Automated data storage via n8n
- **External APIs** - Custom webhook endpoints
- **Zapier/Make** - Webhook automation platforms
- **Custom systems** - POST endpoint integration

---
*This file is optimized for AI/LLM systems to provide maximum context with minimal tokens when analyzing the codebase.*
