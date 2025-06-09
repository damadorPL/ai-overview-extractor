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

## 🚀 **Wersjonowanie**
- **v1.0.2** - Aktualna wersja z webhook'ami
- **Manifest V3** - Nowoczesny standard rozszerzeń
- **Chrome + Firefox** - Wsparcie cross-browser

---
*Plik stworzony dla AI/LLM w celu oszczędzenia tokenów przy analizie kodu.*
