# n8n Workflow Template - AI Overview Extractor

🚀 **Complete n8n workflow for comprehensive AI Overview automation with browser extension integration**

This template contains a complete n8n workflow that works with the AI Overview Extractor browser extension for automatic processing and analysis of AI Overview data.

## 📋 What does this workflow do?

### 🔄 Main functions:
1. **Webhook endpoint** - receives data from browser extension
2. **HTML→Markdown processing** - automatic content conversion
3. **Google Sheets storage** - archives all AI Overviews
4. **AI Guidelines Generator** - LLM analyzes and generates SEO guidelines
5. **Batch processing** - analyzes multiple pages from Google Sheets
6. **Scheduler** - automatic execution every 15 minutes

### 📊 Data flow:
```
Browser Extension → Webhook → Processing → Google Sheets → AI Analysis → SEO Guidelines
```

## 🛠️ Installation

### Step 1: Import workflow
1. **Open n8n** (locally `http://localhost:5678` or in cloud)
2. **Navigate to:** Menu → `Workflows` → `Add workflow` → `Import from JSON`
3. **Load file:** `AI_OVERVIES_EXTRACTOR_TEMPLATE.json`
4. **Save workflow**

### Step 2: Configure Google Sheets
1. **Create Google Sheet** with columns:
   ```
   extractedAt | searchQuery | sources | markdown | myURL | task | guidelines | key
   ```

Here is a public Google Sheet template: https://docs.google.com/spreadsheets/d/15xqZ2dTiLMoyICYnnnRV-HPvXfdgVeXowr8a7kU4uHk/edit?gid=0#gid=0

2. **In n8n add Google Sheets credential:**
   - Go to: `Settings` → `Credentials` → `Add credential`
   - Select: `Google Sheets OAuth2 API`
   - Authorize Google access
3. **Set sheet URL** in nodes:
   - `Get URLs to Analyze`
   - `Save AI Overview to Sheets` 
   - `Save SEO Guidelines to Sheets`

### Step 3: Configure LLM (OpenRouter)
1. **Register at OpenRouter:** https://openrouter.ai/
2. **Generate API key**
3. **In n8n add OpenRouter credential:**
   - `Settings` → `Credentials` → `Add credential`
   - Select: `OpenRouter API`
   - Paste API key
4. **Assign credential** to `Gemini 2.5 Pro Model` node

### Step 4: Activation
1. **Set webhook URL** - copy from `Webhook` node, remember **POST** method!
2. **Activate workflow** - toggle in top right corner
3. **Test webhook** - should respond on port 5678

## ⚙️ Browser Extension Setup

### Download Extension:
- **Chrome:** https://chromewebstore.google.com/detail/ai-overview-extractor/cbkdfibgmhicgnmmdanlhnebbgonhjje
- **Firefox:** https://addons.mozilla.org/en-US/firefox/addon/ai-overview-extractor/
- **GitHub:** https://github.com/romek-rozen/ai-overview-extractor/

### Webhook URL:
```
http://localhost:5678/webhook/ai-overview-extractor-template-123456789
```

### Test connection:
1. In extension paste webhook URL
2. Click "🧪 Test" 
3. Should show: ✅ Connection test successful

## 📁 Workflow Structure

### Triggers:
- **Webhook** - for data from browser extension
- **Manual Trigger** - manual execution
- **Schedule Trigger** - automatically every 15 minutes

### Main nodes:
1. **Extract Webhook Data** (Set) - extracts data from webhook payload
2. **Convert AI Overview to Markdown** - converts HTML to markdown
3. **Save AI Overview to Sheets** (Google Sheets) - saves AI Overview data
4. **Get URLs to Analyze** (Google Sheets) - retrieves tasks for analysis
5. **Fetch Page Content** (HTTP Request) - fetches page content
6. **Generate SEO Recommendations** (LLM Chain) - generates AI guidelines
7. **Save SEO Guidelines to Sheets** (Google Sheets) - saves guidelines

### Helper nodes:
- **Limit** - limits to 10 records at a time
- **myURL Exists** (Filter) - filters records with URLs
- **Process URLs in Batches** (Split in Batches) - batch processing
- **Wait** - delay between requests
- **Extract Page Title and H1** - extracts page metadata
- **Convert Page Content to Markdown** - converts page HTML to markdown

## 🎯 How to use

### 1. Basic usage (Webhook):
1. **Search on Google** for something with AI Overview
2. **Use extension** - click "📋 Extract to Markdown"
3. **Send webhook** - click "🚀 Send webhook"
4. **Check sheet** - data should appear automatically

### 2. Batch analysis (Manual/Scheduler):
1. **In Google Sheet add:**
   - Column `myURL`: URLs of pages to analyze
   - Column `task`: value "create guidelines"
2. **Run workflow** manually or wait for scheduler
3. **Check `guidelines` column** - AI will generate SEO guidelines

### 3. Automation:
- **Scheduler** runs every 15 minutes
- **Analyzes max 10 records** at a time
- **Skips already processed** (with filled `guidelines` column)

## 🔧 Customization

### Change AI model:
```json
// In Gemini 2.5 Pro Model node change:
"model": "google/gemini-2.5-pro-preview"
// To another model e.g.:
"model": "anthropic/claude-3.5-sonnet"
"model": "openai/gpt-4o"
```

### Change scheduler interval:
```json
// In Schedule Trigger node change:
"interval": [{"field": "minutes", "minutesInterval": 15}]
// To different interval e.g.:
"interval": [{"field": "hours", "hoursInterval": 1}]
```

### Customize AI prompt:
In the `Generate SEO Recommendations` node you can modify the system prompt to have AI generate different types of analyses.

## 🔍 Troubleshooting

### Webhook not working:
- Check if n8n is running on port 5678
- Make sure workflow is active
- Check n8n logs in console

### Google Sheets errors:
- Check if credential is properly configured
- Make sure sheet has appropriate columns
- Check sheet permissions

### OpenRouter errors:
- Check if you have sufficient credits on account
- Make sure API key is active
- Check if selected model is available

### Timeout errors:
- Increase timeout in `Wait` node if pages load slowly
- Decrease number in `Limit` node if processing is too slow

## 📊 Monitoring

### n8n logs:
- Check executions in `Executions` section
- Analyze errors in individual nodes
- Monitor API call usage

### Google Sheets metrics:
- Number of processed AI Overviews
- Guidelines generation time
- Effectiveness of different AI models

## 💡 Tips

### Optimization:
- Use `Limit` to avoid overloading APIs
- Add `Wait` between requests to avoid rate limits
- Regularly clean old data in sheet

### Security:
- Protect API keys (don't share workflow with keys)
- Use HTTPS for webhooks in production
- Limit access to Google Sheets

### Scaling:
- Run n8n in cloud for better reliability
- Use databases instead of Google Sheets for larger volumes
- Consider caching AI results

## 📈 Use Cases

### SEO Agency:
- Monitor AI Overview for clients
- Automatic SEO report generation
- Track SERP changes

### Content Marketing:
- Analyze AI Overview trends
- New content inspiration
- Optimize existing articles

### E-commerce:
- Monitor AI Overview for products
- Competition analysis
- Product description optimization

## 🔄 Updates

This template is regularly updated. To get the latest version:

1. Check GitHub repo: https://github.com/romek-rozen/ai-overview-extractor
2. Compare with current workflow
3. Replace old template with new one
4. Reconfigure credentials if needed

## 🤝 Support

Need help? Check:
- **GitHub Issues:** https://github.com/romek-rozen/ai-overview-extractor/issues
- **n8n Community:** https://community.n8n.io/
- **n8n Documentation:** https://docs.n8n.io/

---

**Created with ❤️ for AI Overview automation**
