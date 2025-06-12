# How it works

Distill what your flow does in a few high-level steps:

• **Extract AI Overviews from Google Search** - Receives data from browser extension via webhook
• **Convert HTML to Markdown** - Automatically processes and cleans AI Overview content  
• **Store in Google Sheets** - Archives all extracted AI Overviews with metadata and sources
• **Generate SEO Guidelines** - AI analyzes page content vs AI Overview to suggest improvements
• **Automate Analysis** - Batch process multiple URLs and schedule regular checks

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
- OpenRouter API key (or other LLM provider) for AI analysis  
- Browser extension installed from the GitHub repository
- n8n instance (local or cloud)

## Use cases:
- **SEO agencies** - Monitor AI Overview presence for client keywords
- **Content marketers** - Analyze what content gets featured in AI Overviews
- **E-commerce** - Track AI Overview coverage for product-related searches
- **Research** - Build datasets of AI Overview content across different topics

The workflow comes with a free browser extension that automatically extracts AI Overview content from Google Search and sends it via webhook to your n8n workflow for processing and analysis.
