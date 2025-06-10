# Chrome Web Store - Permission Justifications

## storage justification

The extension requires storage permission to save webhook configuration URLs. Specifically:

1. **Webhook URL storage** - Users can configure custom webhook endpoints for automated data sending
2. **Configuration persistence** - Webhook URLs are saved using chrome.storage.local API
3. **User convenience** - Saved configuration eliminates need to re-enter webhook URLs

### storage Permission Usage:
1. **Webhook URL saving in webhook-manager.js line 20:** `chrome.storage.local.set({ [this.storageKey]: webhookUrl })`
2. **Webhook URL retrieval in webhook-manager.js line 35:** `chrome.storage.local.get([this.storageKey])`
3. **Configuration removal in webhook-manager.js line 50:** `chrome.storage.local.remove([this.storageKey])`

The storage permission is essential for webhook functionality - without it, users would need to re-enter webhook URLs every time they use the extension.

## host_permissions (*://www.google.com/*) justification

The extension requires host permissions for google.com to inject content scripts and access Google Search pages. Specifically:

1. **Content script injection** - Extension needs to run on Google Search result pages
2. **AI Overview detection** - Access to DOM elements like #m-x-content container
3. **Source extraction** - Reading links and content from Google Search results
4. **Button injection** - Adding extraction button to Google Search interface

### host_permissions Usage:
1. **Content script execution** - Defined in manifest.json content_scripts section
2. **DOM access in content.js** - document.querySelector('#m-x-content') and other DOM operations
3. **Search query extraction** - Reading URL parameters from window.location.href
4. **Dynamic UI injection** - Adding extraction button and modal overlay

The host permission for google.com is essential for core functionality - the extension specifically extracts AI Overview content from Google Search results and cannot function without access to Google's domain.

## Summary

Both permissions are actively used and essential for the extension's core functionality:
- **storage**: Required for webhook URL configuration persistence
- **host_permissions**: Required for accessing Google Search pages and extracting AI Overview content

The extension follows the principle of least privilege by requesting only the minimal permissions necessary for its functionality.
