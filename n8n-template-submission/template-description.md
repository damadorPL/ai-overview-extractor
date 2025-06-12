# How it works
• **Extract AI Overviews from Google Search** - Receives data from browser extension via webhook
• **Convert HTML to Markdown** - Automatically processes and cleans AI Overview content  
• **Store in Google Sheets** - Archives all extracted AI Overviews with metadata and sources
• **Generate SEO Guidelines** - AI analyzes page content vs AI Overview to suggest improvements
• **Automate Analysis** - Batch process multiple URLs and schedule regular checks

# Set up steps
• **Import workflow** - Load the JSON template into your n8n instance (2 minutes)
• **Configure Google Sheets** - Set up OAuth connection and create spreadsheet with required columns (5 minutes)  
• **Set up AI provider** - Add OpenRouter API credentials for Gemini 2.5 Pro (3 minutes)
• **Install browser extension** - Deploy the companion Chrome/Firefox extension for data extraction (5 minutes)
• **Test webhook endpoint** - Verify the connection between extension and n8n workflow (2 minutes)

**Total setup time: ~15 minutes**

## What you'll need:
- Google account for Sheets integration
- [Google Sheet template](https://docs.google.com/spreadsheets/d/15xqZ2dTiLMoyICYnnnRV-HPvXfdgVeXowr8a7kU4uHk/edit?gid=0#gid=0) with required columns
- OpenRouter API key for Gemini 2.5 Pro model access
- Browser extension: [Chrome Extension](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) or [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)
- n8n instance (local or cloud)

## Use cases:
- **SEO agencies** - Monitor AI Overview presence for client keywords
- **Content marketers** - Analyze what content gets featured in AI Overviews
- **E-commerce** - Track AI Overview coverage for product-related searches
- **Research** - Build datasets of AI Overview content across different topics

The workflow comes with a free browser extension ([Chrome](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)) that automatically extracts AI Overview content from Google Search and sends it via webhook to your n8n workflow for processing and analysis.

**GitHub Repository:** https://github.com/romek-rozen/ai-overview-extractor/
