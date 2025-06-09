# Reviewer Notes v1.0.4 - Firefox Add-ons

## 🔍 Changes overview in this version

### v1.0.4 - English Translation Update
• **Interface translation** - Complete UI translation from Polish to English
• **Documentation** - Fully translated README.md and user guides
• **User messages** - All buttons, notifications and console messages in English
• **Global accessibility** - Extension now ready for international distribution
• **No functional changes** - All core features remain identical to v1.0.3

### v1.0.3 - Previous version (Webhooks functionality)
• **`storage` permission** - Added in manifest v1.0.3 for webhook configuration storage
• **Usage:** `chrome.storage.local` to save webhook URL (optional by user)
• **Security:** No sync, local storage only

### New files (since v1.0.3)
• **`src/webhook-manager.js`** - New module for webhook POST management
• **Firefox extension ID** - `ai-overview-extractor@rozenberger.com` in `browser_specific_settings.gecko`

## 🔒 Security and privacy

### Webhooks are fully optional
• **Disabled by default** - no data sent without conscious user configuration
• **User interaction required** - user must click "Webhook Configuration" and enter URL
• **Test required** - URL must be successfully tested before saving

### Security validation
• **HTTPS required** - webhooks require HTTPS (exception: localhost for dev)
• **5s timeout** - protection against hanging requests
• **AbortController** - proper request cancellation
• **Error handling** - safe network error handling

### Data transparency
Data sent by webhook (ONLY if configured):
```json
{
  "searchQuery": "search keywords",
  "aiOverview": {
    "content": "Markdown content", 
    "htmlContent": "clean HTML content"
  },
  "sources": ["array of source links"],
  "metadata": {
    "timestamp": "ISO timestamp",
    "extensionVersion": "1.0.4",
    "userAgent": "browser string",
    "googleSearchUrl": "Google page URL"
  }
}
```

## 🛠️ Technical implementation

### Content Security Policy
• **No `eval()`** - code doesn't use eval or similar functions
• **Inline scripts** - all scripts in separate files
• **XSS protection** - input sanitization for webhook URLs

### Network requests
• **Webhooks only** - no other network connections
• **User consent** - requires conscious user configuration
• **No tracking** - no analytics, telemetry, tracking

### DOM manipulation
• **Read-only on Google** - extension only reads AI Overview content
• **Injection safety** - safe UI injection (createElement, not innerHTML)
• **Clean up** - proper event listener removal

## 🧪 Testing and verification

### Functionality without webhooks
• **Core features** - work identically as in v1.0.2
• **Copy/download** - no changes in basic functionality
• **UI/UX** - added webhook section in modal (hidden by default)

### Webhook testing
• **Test endpoint:** https://httpbin.org/post (safe test service)
• **Local test:** http://localhost:3000/webhook (for dev)
• **Error cases:** invalid URL, timeout, network error

### Compatibility
• **Firefox Manifest V3** - full compliance
• **Extension ID** - required `browser_specific_settings.gecko.id`
• **Permissions model** - according to Firefox guidelines

## 🌍 Translation verification (v1.0.4)

### User interface elements
• **Main button:** "📋 Extract to Markdown" (was "Ekstraktuj do Markdown")
• **Close button:** "❌ Close" (was "Zamknij")
• **Headers:** "Search Query:", "Sources" (was "Wyszukiwane hasło:", "Źródła")
• **Webhook section:** All text in English

### Console messages
• **Developer logs** - All console.log messages translated to English
• **Error messages** - Consistent English terminology
• **Debug information** - Readable for international developers

### Documentation
• **README.md** - Complete translation with all sections
• **Release notes** - Updated for global audience
• **Technical docs** - English terminology throughout

## 📋 Reviewer checklist

✅ **Manifest.json** - check browser_specific_settings and storage permission  
✅ **Webhooks optional** - disabled by default, configuration required  
✅ **HTTPS validation** - secure connections only (+ localhost)  
✅ **Input sanitization** - webhook URL validation  
✅ **No external requests** - except optional webhooks  
✅ **Privacy policy** - updated for webhooks in docs/  
✅ **Error handling** - timeout, network errors, invalid responses  
✅ **UI/UX** - webhook UI only after clicking "Configuration"  
✅ **English translation** - complete interface translation (v1.0.4)  
✅ **Version consistency** - 1.0.4 across all files  

## 📧 Contact
• **Developer:** Roman Rozenberger (roman@rozenberger.com)
• **GitHub:** https://github.com/romek-rozen/ai-overview-extractor
• **Documentation:** Complete in `docs/` folder

## 🔍 Additional notes for reviewers

### Source code clarity
• **No obfuscation** - all JavaScript files are readable
• **No minification** - development code submitted directly
• **Clear structure** - logical file organization
• **Comments** - code documented in English

### Testing recommendations
1. **Test basic functionality:** Extract AI Overview without webhooks
2. **Test webhook configuration:** Try setting up and testing webhook URL
3. **Test English interface:** Verify all UI elements display in English
4. **Test error handling:** Invalid webhook URLs, network timeouts

### Privacy compliance
• **No data collection** without explicit user action
• **Local storage only** for webhook configuration
• **Transparent data usage** as documented above
• **User control** over all network requests
