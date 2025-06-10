# Chrome Web Store - Privacy Justifications

## Data Collection and Usage

The AI Overview Extractor extension is designed with privacy as a core principle. Here's how we handle data:

### What data we collect:
- **AI Overview content** - Only when user explicitly clicks "Extract to Markdown" button
- **Search query** - Extracted from current Google Search URL for context
- **Source links** - Links referenced in AI Overview for completeness
- **Webhook URLs** - Only when user configures webhook functionality (stored locally)

### What data we DON'T collect:
- **Personal information** - No names, emails, or personal data
- **Browsing history** - No tracking of user's browsing patterns
- **Search history** - No storage of previous searches
- **Automatic data** - No background data collection without user action

## Data Storage

### Local Storage Only:
- **Webhook URLs** - Stored locally in browser using chrome.storage.local
- **No cloud storage** - All data remains on user's device
- **No external databases** - Extension doesn't maintain any external data storage
- **User control** - Users can clear stored data anytime through browser settings

### Data Processing:
- **Client-side only** - All content processing happens locally in browser
- **No server processing** - Extension doesn't send data to our servers
- **Optional webhooks** - Data only sent to user-configured endpoints (user's choice)

## Permissions and Their Usage

### storage permission:
**Purpose:** Save webhook configuration URLs locally
**Data accessed:** Only webhook URLs that user explicitly configures
**Storage location:** Local browser storage (chrome.storage.local)
**User control:** Can be cleared through browser settings

### host_permissions (*://www.google.com/*):
**Purpose:** Access Google Search pages to extract AI Overview content
**Data accessed:** Only AI Overview content visible on current page
**Trigger:** Only when user clicks extraction button
**Scope:** Limited to Google Search result pages only

## Data Sharing

### No Third-Party Sharing:
- **No analytics** - Extension doesn't use Google Analytics or similar services
- **No advertising** - No data shared with advertising networks
- **No data brokers** - No data sold or shared with third parties
- **No tracking** - No user behavior tracking

### Optional User-Controlled Sharing:
- **Webhooks** - Users can optionally configure webhooks to send extracted data to their own systems
- **User choice** - Webhook functionality is entirely optional and user-controlled
- **User endpoints** - Data only sent to URLs that user explicitly configures

## Security Measures

### Data Protection:
- **HTTPS validation** - Webhook URLs must use HTTPS (except localhost for testing)
- **Input validation** - All user inputs are validated before processing
- **No script injection** - Content is sanitized to remove JavaScript and CSS
- **Timeout protection** - Network requests have 5-second timeout limits

### Code Security:
- **Content Security Policy** - Extension follows CSP best practices
- **Minimal permissions** - Only requests permissions absolutely necessary for functionality
- **Open source** - Code is publicly available for security review
- **No obfuscation** - All code is readable and transparent

## User Rights and Control

### User Control:
- **Explicit consent** - All data extraction requires explicit user action (button click)
- **Data visibility** - Users see exactly what data is extracted before any action
- **Configuration control** - Users have full control over webhook configuration
- **Data deletion** - Users can clear all stored data through browser settings

### Transparency:
- **Open source** - Full source code available on GitHub
- **Clear documentation** - Detailed explanation of all functionality
- **Privacy policy** - Comprehensive privacy policy available
- **No hidden functionality** - All features clearly documented and visible

## Compliance

### Privacy Standards:
- **GDPR compliant** - No personal data collection, user control over all data
- **CCPA compliant** - No sale of personal information, user control over data
- **Minimal data collection** - Only collects data necessary for functionality
- **Purpose limitation** - Data only used for stated purpose (AI Overview extraction)

### Browser Standards:
- **Manifest V3** - Uses latest Chrome extension security standards
- **Chrome Web Store policies** - Complies with all Chrome Web Store requirements
- **Firefox policies** - Complies with Mozilla Add-on policies

## Contact and Support

For privacy-related questions or concerns:
- **GitHub Issues:** https://github.com/romek-rozen/ai-overview-extractor/issues
- **Email:** Contact through GitHub profile
- **Documentation:** Complete privacy policy available in repository

## Summary

The AI Overview Extractor extension is designed with privacy by design principles:
- **No automatic data collection** - All data extraction requires explicit user action
- **Local processing only** - No data sent to our servers
- **User control** - Users have complete control over all functionality
- **Transparency** - Open source code and clear documentation
- **Minimal permissions** - Only requests permissions necessary for core functionality

The extension serves as a tool for users to extract and format AI Overview content for their own use, with complete user control and privacy protection.
