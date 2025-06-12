## Who is this for?

SEO agencies, content marketers, e-commerce businesses, and researchers who want to understand and optimize for Google's AI Overviews. Perfect for teams monitoring search visibility and content performance across multiple keywords and websites.

## What problem does this workflow solve?

Google's AI Overviews significantly impact search visibility, but manually tracking which content gets featured is time-consuming. This workflow automates the extraction, analysis, and optimization process, helping you understand why certain content appears in AI Overviews and how to improve your own content accordingly.

## What this workflow does

Transform raw AI Overview data into actionable SEO insights using AI-powered analysis:

• **Extract AI Overviews from Google Search** - Receives clean data from browser extension via webhook
• **Convert AI Overview to Markdown** - Automatically processes and formats extracted content using the "Convert AI Overview to Markdown" node
• **Save AI Overview to Sheets** - Archives all extracted data with metadata and sources in Google Sheets
• **Generate SEO Recommendations** - Gemini 2.5 Pro analyzes your page content against AI Overview content using the "Generate SEO Recommendations" node
• **Process URLs in Batches** - Automatically analyze multiple URLs and schedule regular monitoring

## Setup

Quick 15-minute setup process:

• **Import workflow** - Load the JSON template into your n8n instance (2 minutes)
• **Configure Google Sheets** - Set up OAuth connection and create spreadsheet with required columns (5 minutes)  
• **Set up Gemini 2.5 Pro** - Add OpenRouter API credentials for AI analysis (3 minutes)
• **Install browser extension** - Deploy the companion extension: [Chrome Extension](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) or [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/) (5 minutes)
• **Test webhook endpoint** - Verify connection between extension and n8n using the "Extract Webhook Data" node (2 minutes)

**Total setup time: ~15 minutes**

## What you'll need

- Google account for Sheets integration
- OpenRouter API key for Gemini 2.5 Pro access
- Browser extension: [Chrome Extension](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) or [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)
- n8n instance (local or cloud)

## Use cases

- **SEO agencies** - Monitor AI Overview presence for client keywords and generate optimization reports
- **Content marketers** - Analyze what content gets featured in AI Overviews and identify content gaps
- **E-commerce** - Track AI Overview coverage for product-related searches and optimize product descriptions
- **Research teams** - Build comprehensive datasets of AI Overview content across different industries and topics
- **Digital marketing teams** - Automate competitive analysis and content optimization workflows

## How to customize this workflow to your needs

The workflow is designed for flexibility:

- **Change AI model** - Swap Gemini 2.5 Pro for Claude, GPT-4, or other models in the "Gemini 2.5 Pro Model" node
- **Adjust batch processing** - Modify the "Process URLs in Batches" node to handle more or fewer URLs per run
- **Custom analysis prompts** - Update the "Generate SEO Recommendations" node with industry-specific analysis criteria
- **Alternative storage** - Replace Google Sheets with databases or other storage solutions
- **Scheduling frequency** - Adjust the Schedule Trigger from 15 minutes to your preferred interval

The workflow comes with a free browser extension ([Chrome](https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/)) that automatically extracts AI Overview content from Google Search and sends structured data via webhook to your n8n workflow for processing and analysis.

**GitHub Repository:** https://github.com/romek-rozen/ai-overview-extractor/
