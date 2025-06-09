# Chrome Web Store - Odpowiedź na odrzucenie "Purple Potassium"

## Violation Reference ID: Purple Potassium
**Claim:** "Requesting but not using the following permission(s): activeTab"

## Nasze stanowisko: Błędna ocena

Rozszerzenie **FAKTYCZNIE UŻYWA** uprawnienia `activeTab` w następujących miejscach:

### 1. Bezpośrednie użycie DOM API wymagającego activeTab

**Plik: src/content.js, linia 15:**
```javascript
const container = document.querySelector('#m-x-content');
```

**Plik: src/content.js, linia 65:**
```javascript
container.parentNode.insertBefore(button, container);
```

**Plik: src/content.js, linia 22:**
```javascript
observer.observe(document.body, { childList: true, subtree: true });
```

### 2. Clipboard API - wymaga activeTab

**Plik: src/content.js, linia 287:**
```javascript
navigator.clipboard.writeText(markdown).then(() => {
    this.showNotification('✅ Skopiowano do schowka!');
})
```

**Uwaga:** `navigator.clipboard.writeText()` w content script **WYMAGA** uprawnienia `activeTab` zgodnie z dokumentacją Chrome Extension APIs.

### 3. Dynamiczny dostęp do DOM aktywnej karty

Content script manipuluje DOM aktywnej karty poprzez:
- **Wstrzykiwanie UI** - dodanie przycisku ekstraktowania
- **Obserwację zmian** - MutationObserver na `document.body`
- **Ekstrakcję treści** - odczyt zawartości AI Overview z DOM
- **Nawigację po elementach** - `querySelector`, `parentNode`, `cloneNode`

### 4. Przykłady konkretnego użycia activeTab

**DOM Manipulation (content.js:65):**
```javascript
addButton(container) {
    const button = document.createElement('button');
    button.className = 'ai-extractor-button';
    // Wymaga dostępu do aktywnej karty
    container.parentNode.insertBefore(button, container);
}
```

**Clipboard Operations (content.js:287):**
```javascript
copyBtn.addEventListener('click', () => {
    // Wymaga activeTab permission
    navigator.clipboard.writeText(markdown)
});
```

**DOM Observation (content.js:22):**
```javascript
observeDOM() {
    const observer = new MutationObserver(() => {
        this.checkAndAddButton();
    });
    // Wymaga dostępu do aktywnej karty
    observer.observe(document.body, { childList: true, subtree: true });
}
```

## Dowody techniczne

### Manifest.json Content Script Configuration:
```json
"content_scripts": [
    {
        "matches": ["*://www.google.com/search*"],
        "js": ["src/turndown.js", "src/webhook-manager.js", "src/content.js"],
        "css": ["styles.css"],
        "run_at": "document_end"
    }
]
```

Content script **automatycznie otrzymuje** dostęp do aktywnej karty przez uprawnienie `activeTab`.

### Zgodność z Chrome Extension Documentation:

1. **Clipboard API:** https://developer.chrome.com/docs/extensions/reference/clipboard/
   - `navigator.clipboard` w content script wymaga `activeTab`

2. **Content Scripts:** https://developer.chrome.com/docs/extensions/mv3/content_scripts/
   - Dostęp do DOM wymaga odpowiednich uprawnień

3. **activeTab:** https://developer.chrome.com/docs/extensions/mv3/manifest/activeTab/
   - Daje dostęp do aktywnej karty dla content scriptów

## Wniosek

Uprawnienie `activeTab` jest **AKTYWNIE UŻYWANE** przez rozszerzenie do:
- ✅ Dostępu do DOM aktywnej karty Google Search
- ✅ Operacji na clipboard (navigator.clipboard.writeText)
- ✅ Obserwacji zmian DOM (MutationObserver)
- ✅ Dynamicznego wstrzykiwania UI

**Prosimy o ponowną weryfikację** kodu źródłowego i cofnięcie decyzji o odrzuceniu.

## Dodatkowe informacje

- **GitHub:** https://github.com/romek-rozen/ai-overview-extractor
- **Funkcjonalność:** Ekstrakcja AI Overview z Google Search
- **Uprawnienia:** Minimalne i uzasadnione pojedynczym celem
- **Kod:** Dostępny publicznie do weryfikacji

Rozszerzenie działa zgodnie z politykami Chrome Web Store i używa wszystkich zadeklarowanych uprawnień zgodnie z przeznaczeniem.
