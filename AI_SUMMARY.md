# AI Overview Extractor - Dokumentacja Techniczna dla AI

## 🎯 **Cel rozszerzenia**
Rozszerzenie Chrome/Firefox ekstraktuje treść **AI Overview** z Google Search i konwertuje do **Markdown** z możliwością wysyłania do **webhook'ów** via POST.

## 📁 **Architektura plików**
```
ai-overview-extractor/
├── manifest.json              # Manifest V3, uprawnienia: activeTab, storage
├── styles.css                 # Style UI (modal, przyciski, notyfikacje)
├── src/
│   ├── content.js             # Główna klasa AIOverviewExtractor
│   ├── webhook-manager.js     # Klasa WebhookManager (POST requests)
│   └── turndown.js           # Biblioteka HTML→Markdown
├── icons/                    # Ikony 16-128px
└── docs/                     # Dokumentacja Chrome Web Store
```

## 🏗️ **Główne klasy**

### **AIOverviewExtractor** (`src/content.js`)
```javascript
class AIOverviewExtractor {
    constructor() {
        this.webhookManager = new WebhookManager();
        this.init();
    }
    
    // Kluczowe metody:
    checkAndAddButton()        // Szuka #m-x-content, dodaje przycisk
    extractContent(container)  // Czyści HTML z CSS/JS
    extractSources(container)  // Wyciąga linki źródeł
    createMarkdown(content, sources) // HTML→Markdown via TurndownService
    showPreview(markdown)      // Modal z podglądem i webhook UI
    handleWebhookSend(markdown) // Integracja z WebhookManager
}
```

### **WebhookManager** (`src/webhook-manager.js`)
```javascript
class WebhookManager {
    // Kluczowe metody:
    saveWebhookUrl(url)        // Zapisuje URL w chrome.storage
    getWebhookUrl()           // Pobiera URL z storage
    testWebhook(url)          // Test POST z payload testowym
    sendToWebhook(data)       // Wysyła dane POST do webhook
    makeRequest(url, payload) // fetch() z timeout 5s
}
```

## 📡 **Webhook API**

### **POST Request**
```javascript
POST https://your-webhook.com/endpoint
Content-Type: application/json
```

### **Payload Structure**
```json
{
  "timestamp": "2025-01-06T12:30:00Z",
  "searchQuery": "słowo kluczowe",
  "aiOverview": {
    "content": "markdown bez CSS/JS",
    "htmlContent": "oczyszczony HTML"
  },
  "sources": [
    {
      "title": "Tytuł źródła",
      "url": "https://clean-url.com"
    }
  ],
  "metadata": {
    "googleSearchUrl": "https://google.com/search?q=...",
    "extractedAt": "2025-01-06T12:30:00Z",
    "userAgent": "Mozilla/5.0...",
    "extensionVersion": "1.0.2"
  }
}
```

## 🧩 **Kluczowe selektory DOM**
- **AI Overview kontener:** `#m-x-content`
- **Elementy MSC (do usunięcia):** `div[data-subtree="msc"]`
- **Sekcja źródeł:** `div[style="height: 100%;"]`
- **Lista źródeł:** `ul[class]` (pierwszy w kontenerze źródeł)
- **Ukryte elementy:** `[style*="display:none"]`

## 🧹 **Czyszczenie treści** (`extractContent()`)

### **Usuwane elementy:**
- `<style>` i `<script>` tagi
- Atrybuty: `style`, `class`, `data-ved`, `jscontroller`
- Inline JavaScript: `(function(){...})()`, `onclick=`
- Fragmenty JS: zmienne, funkcje

### **Regex patterns:**
```javascript
cleanHTML.replace(/\(function\(\)[^}]*\{[^}]*\}\)\(\);?/g, '');
cleanHTML.replace(/on\w+\s*=\s*["'][^"']*["']/g, '');
cleanHTML.replace(/var\s+\w+\s*=\s*[^;]*;/g, '');
```

## 🎨 **UI Komponenty**

### **Modal struktura:**
```
.ai-extractor-overlay
└── .ai-extractor-modal
    ├── .ai-extractor-header (tytuł + ❌ zamknij)
    ├── .ai-extractor-textarea (podgląd markdown)
    ├── .ai-extractor-webhook-section (konfiguracja URL)
    └── .ai-extractor-footer (📋 kopiuj, 💾 pobierz, 🚀 webhook)
```

### **Webhook konfiguracja UI:**
- **Input URL:** `<input type="url" class="ai-extractor-webhook-input">`
- **Test:** `🧪 Test` - wywołuje `testWebhook()`
- **Zapisz:** `💾 Zapisz` - wywołuje `saveWebhookUrl()`
- **Status:** Dynamiczny komunikat o stanie konfiguracji

## ⚙️ **Konfiguracja**

### **Manifest.json kluczowe sekcje:**
```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["*://www.google.com/search*"],
    "js": ["src/turndown.js", "src/webhook-manager.js", "src/content.js"]
  }]
}
```

### **Storage keys:**
- `ai-overview-webhook-url` - URL webhook (string)

## 🔄 **Flow wykonania**
1. **Obserwator DOM** - wykrywa `#m-x-content`
2. **Dodanie przycisku** - "📋 Ekstraktuj do Markdown"
3. **Kliknięcie** → `extractContent()` + `extractSources()`
4. **Konwersja** → `createMarkdown()` via TurndownService
5. **Modal** → `showPreview()` z webhook UI
6. **Webhook** → `handleWebhookSend()` → POST request

## 🛡️ **Bezpieczeństwo**
- **HTTPS tylko** - webhook URL walidacja
- **Timeout 5s** - AbortController w fetch()
- **Sanityzacja** - usuwanie JS/CSS z treści
- **Error handling** - try/catch z komunikatami

## 📝 **Przykład użycia kodu**
```javascript
// Inicjalizacja
const extractor = new AIOverviewExtractor();

// Manualny webhook
const data = {
  searchQuery: "test",
  content: "markdown",
  htmlContent: "<p>html</p>",
  sources: [{title: "Test", url: "https://test.com"}]
};
await extractor.webhookManager.sendToWebhook(data);
```

## 🔗 **Integracja n8n** (NOWOŚĆ!)

### **Template workflow** (`workflowk_templates/AI_Overviews_Extractor_Plugin.json`)
Kompletny n8n workflow do automatyzacji AI Overview:

#### **Architektura workflow:**
```
Webhook → Data Processing → Google Sheets → AI Analysis → Guidelines
```

#### **Główne węzły:**
1. **Webhook** - endpoint `/ai-overview-extractor` (port 5678)
2. **data** (Set) - ekstrakcja z payload: `searchQuery`, `htmlContent`, `sources`
3. **Markdown** - konwersja HTML→Markdown
4. **updateRows** (Google Sheets) - zapis AI Overview
5. **Basic LLM Chain** - AI generuje wytyczne SEO
6. **Schedule Trigger** - automatyka co 15 minut

#### **Payload mapping:**
```javascript
// Z webhook do Google Sheets:
{
  key: `${searchQuery} ${extractedAt}`,
  extractedAt: timestamp,
  searchQuery: query,
  sources: formatted_sources,
  markdown: converted_content
}
```

#### **AI Prompt (wytyczne SEO):**
```
System: "Alice analizuje AI Overview vs treść strony"
Input: searchQuery + htmlContent + aiOverview
Output: "Co dodać na stronę aby znaleźć się w AI Overview"
```

#### **Google Sheets struktura:**
```
extractedAt | searchQuery | sources | markdown | myURL | task | guidelines | key | row_number
```

#### **Automatyzacja flow:**
1. **Webhook flow:** Plugin → n8n → Google Sheets (natychmiastowy)
2. **Batch flow:** Google Sheets → Page Analysis → AI Guidelines (co 15 min)
3. **Filtering:** Tylko rekordy z `task="create guidelines"` i `myURL`

#### **Konfiguracja webhook w plugin:**
```javascript
webhookUrl: "http://localhost:5678/webhook/ai-overview-extractor"
testPayload: { test: true, timestamp: ISO_string, message: "Test..." }
```

## 🚀 **Wersjonowanie**
- **v1.0.3** - Aktualna z webhook'ami + n8n template
- **Manifest V3** - Nowoczesny standard rozszerzeń
- **Chrome + Firefox** - Wsparcie cross-browser
- **n8n integration** - Gotowy workflow template

---
*Plik stworzony dla AI/LLM w celu oszczędzenia tokenów przy analizie kodu.*
