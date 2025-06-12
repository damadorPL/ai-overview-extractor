# Changelog

All notable changes to the AI Overview Extractor extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2024-12-06

### Added
- **Auto-expand AI overviews feature** - Automatically clicks "Show more" button on collapsed AI overviews
- **Settings management system** - Persistent storage of user preferences using Chrome storage API
- **Extension popup interface** - Modern settings panel accessible from browser toolbar
- **Real-time settings synchronization** - Changes applied immediately across all Google.com tabs
- Toggle switch for auto-expand functionality with on/off control

### Changed
- Extension name updated to "AI Overview Extractor - Features"
- Updated manifest.json to include popup interface and new permissions
- Enhanced content script with message handling for settings communication

### Technical Details
- Added `SettingsManager` class for settings persistence
- Implemented popup UI with toggle switches and status indicators
- Added automatic detection of collapsed AI overviews using `[aria-expanded="false"][aria-controls="m-x-content"]` selector
- Integrated real-time communication between popup and content scripts

---

## [1.0.5] - 2025-06-10

### Fixed
- Chrome Web Store compliance - removed unnecessary `activeTab` permission
- Improved stability and error handling
- Enhanced source extraction reliability

### Changed
- Code optimization and performance improvements
- Updated all permission justifications and descriptions

---

## [1.0.4] - 2025-06-09

### Added
- Complete English translation - interface and documentation
- Webhook functionality for sending extracted data to external services
- Webhook configuration and testing interface

### Changed
- Enhanced markdown conversion with better formatting
- Improved source link extraction
- Updated button text and user messages
- Code cleanup and improved console messages

---

## [1.0.3] - 2025-06-09

### Added
- Enhanced source extraction from AI overviews
- Better handling of Google URL redirects
- Webhooks - automatic data sending to external APIs
- Webhook configuration UI for URL setup and testing

### Fixed
- Source link cleaning and deduplication
- Improved error handling for edge cases
- Improved content cleaning - removal of CSS, JavaScript and inline styles

### Technical Details
- Chrome Storage for secure configuration storage
- HTTPS validation for webhook security
- Timeout handling with 5s limits
