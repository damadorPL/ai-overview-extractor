# How it works

Distill what your flow does in a few high-level steps:

• **Extract AI Overviews from Google Search** - Receives data from browser extension via webhook
• **Convert AI Overview to Markdown** - Automatically processes and cleans AI Overview content  
• **Save AI Overview to Sheets** - Archives all extracted AI Overviews with metadata and sources
• **Generate SEO Recommendations** - AI analyzes page content vs AI Overview to suggest improvements
• **Process URLs in Batches** - Batch process multiple URLs and schedule regular checks

# Set up steps

Give users an idea of how long set up will take. Don't describe every detail.

• **Import workflow** - Load the JSON template into your n8n instance (2 minutes)
• **Configure Google Sheets** - Set up OAuth connection and create spreadsheet with required columns (5 minutes)  
• **Set up AI provider** - Add OpenRouter or other LLM provider API credentials (3 minutes)
• **Install browser extension** - Deploy the companion Chrome/Firefox extension for data extraction (5 minutes)
• **Test webhook endpoint** - Verify the connection between extension and n8n workflow (2 minutes)

Keep detailed descriptions in sticky notes inside your workflow

**Total setup time: ~15 minutes**

## What you'll need:
- Google account for Sheets integration
- [Google Sheet template](https://docs.google.com/spreadsheets/d/15xqZ2dTiLMoyICYnnnRV-HPvXfdgVeXowr8a7kU4uHk/edit?gid=0#gid=0) with required columns
- OpenRouter API key (or other LLM provider) for AI analysis  
- Browser extension: [Chrome Extension](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) or [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)
- n8n instance (local or cloud)

## Use cases:
- **SEO agencies** - Monitor AI Overview presence for client keywords
- **Content marketers** - Analyze what content gets featured in AI Overviews
- **E-commerce** - Track AI Overview coverage for product-related searches
- **Research** - Build datasets of AI Overview content across different topics

The workflow comes with a free browser extension ([Chrome](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)) that extracts AI Overview content from Google Search and sends it via webhook to your n8n workflow for processing and analysis.

**GitHub Repository:** https://github.com/romek-rozen/ai-overview-extractor/
