# Chrome Web Store - Uzasadnienia uprawnień v1.0.3

## activeTab justification

The extension requires activeTab permission to access the currently active Google Search tab's DOM to extract AI Overview content. Specifically: 1) Content script uses document.querySelector('#m-x-content') to locate AI Overview containers, 2) MutationObserver monitors DOM changes for dynamically loaded AI Overview content, 3) navigator.clipboard.writeText() requires activeTab to copy extracted Markdown to clipboard, 4) Dynamic UI injection (adding extract button) needs DOM access to the active tab. This permission is essential for the core functionality - without it, the extension cannot detect, access or extract AI Overview content from Google Search results.

## storage justification

The extension uses chrome.storage.local to store user-configured webhook URLs for automated data sending (optional feature). The storage contains only the webhook endpoint URL that users voluntarily configure. No personal data, search history, or extracted content is stored persistently. Data is stored locally only (not synced) for privacy. This permission allows users to save their preferred webhook configuration so they don't need to re-enter the URL each time they want to automatically send extracted AI Overview data to their external systems or APIs.

## Host permission justification

The extension requires access to "*://www.google.com/*" to function exclusively on Google Search pages where AI Overview appears. This specific host permission is necessary because: 1) AI Overview content only exists on Google Search result pages, 2) Content script must inject into google.com to detect #m-x-content containers, 3) The extension's sole purpose is extracting AI Overview from Google Search - no other sites are needed, 4) Narrow scope ensures minimal permissions following security best practices. Without google.com access, the extension cannot fulfill its core function of detecting and extracting AI Overview content.

## Remote Code Usage

**Answer: No, I am not using remote code**

The extension includes all dependencies locally:
- turndown.js library is bundled within the extension package
- No external script loading or remote code execution
- All JavaScript files are static and included in the extension package
- No eval() or dynamic code generation

## Additional Evidence of Permission Usage

### activeTab Permission Usage:
1. **DOM Access in content.js line 15:** `document.querySelector('#m-x-content')`
2. **DOM Manipulation line 65:** `container.parentNode.insertBefore(button, container)`
3. **Clipboard API line 287:** `navigator.clipboard.writeText(markdown)`
4. **DOM Observer line 22:** `observer.observe(document.body, { childList: true, subtree: true })`

### storage Permission Usage:
1. **Webhook URL storage in webhook-manager.js:** `chrome.storage.local.set()`
2. **Webhook URL retrieval:** `chrome.storage.local.get()`
3. **Optional user configuration:** Only saves webhook URLs when user explicitly configures them

### Host Permission Usage:
1. **Content script injection** defined in manifest.json matches: `"*://www.google.com/search*"`
2. **AI Overview detection** requires access to Google Search DOM structure
3. **No other domains accessed** - extension is single-purpose for Google Search

These permissions are minimal and necessary for the declared functionality of extracting AI Overview content from Google Search results.
