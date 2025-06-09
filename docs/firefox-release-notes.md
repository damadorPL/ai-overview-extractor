# Release Notes v1.0.4 - for users

## 🚀 What's new in version 1.0.4

### English Translation - Global Accessibility
• **New feature:** Complete interface translation to English
• **User interface:** All buttons, messages and notifications in English
• **Documentation:** Fully translated README and user guides
• **Global reach:** Extension now accessible to international users

### Technical improvements
• **Code cleanup:** Improved console messages and developer logs
• **Comments:** All code comments updated for better maintainability
• **Standards:** Consistent English terminology throughout codebase

## 🌍 Previous version (v1.0.3)

## 🚀 What's new in version 1.0.3

### Webhooks - workflow automation
• **New feature:** Automatic sending of extracted data to external systems
• **Configuration:** Easy webhook URL setup in extension interface
• **Connection test:** Check if webhook works before saving
• **Security:** HTTPS requirement (except localhost for testing)

### Improved content quality
• **Clean content:** Automatic removal of CSS and JavaScript elements from extracted content
• **Better formatting:** Removal of unnecessary Google attributes from links
• **Faster performance:** Performance optimizations for larger AI Overview content

### For developers and automation
• **JSON API:** Standard format for data sent through webhooks
• **Metadata:** Timestamp, extension version, User Agent in every webhook
• **Error handling:** Connection error information with 5-second timeout

## 🔒 Privacy and security
• **Optional:** Webhooks are disabled by default - you must consciously configure them
• **Local storage:** Webhook configuration saved only in your browser
• **Transparency:** Clear information about what data is sent
• **User control:** Full control over where and when to send data

## ⚡ Compatibility
• **Full backward compatibility:** All previous features work without changes
• **Firefox Manifest V3:** Compatibility with latest standards
• **No breaking changes:** Update won't affect current usage

---

**How to use webhooks:**
1. Click "Extract to Markdown" button next to AI Overview
2. In modal click "Webhook Configuration"
3. Enter your API URL and click "Test"
4. After successful test click "Save"
5. From now data will be automatically sent to your system!
