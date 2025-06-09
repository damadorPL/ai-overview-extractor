# Uwagi dla recenzentów v1.0.3 - Firefox Add-ons

## 🔍 Przegląd zmian w tej wersji

### Nowe uprawnienia
• **`storage`** - Dodane w manifeście v1.0.3 dla przechowywania konfiguracji webhook'ów
• **Użycie:** `chrome.storage.local` do zapisania URL webhook'a (opcjonalnie przez użytkownika)
• **Bezpieczeństwo:** Brak synchronizacji, tylko lokalne przechowywanie

### Nowe pliki
• **`src/webhook-manager.js`** - Nowy moduł do zarządzania webhook'ów POST
• **Firefox extension ID** - `ai-overview-extractor@rozenberger.com` w `browser_specific_settings.gecko`

## 🔒 Bezpieczeństwo i prywatność

### Webhook'i są w pełni opcjonalne
• **Domyślnie wyłączone** - żadne dane nie są wysyłane bez świadomej konfiguracji użytkownika
• **Wymagana interakcja** - użytkownik musi kliknąć "Konfiguracja webhook'ów" i wpisać URL
• **Test wymagany** - przed zapisaniem URL musi być pomyślnie przetestowany

### Walidacja bezpieczeństwa
• **HTTPS required** - webhook'i wymagają HTTPS (wyjątek: localhost dla dev)
• **Timeout 5s** - zabezpieczenie przed hanging requests
• **AbortController** - poprawne anulowanie requestów
• **Error handling** - bezpieczne obsługiwanie błędów sieci

### Przejrzystość danych
Dane wysyłane przez webhook (TYLKO jeśli skonfigurowane):
```json
{
  "searchQuery": "słowa kluczowe wyszukiwania",
  "aiOverview": {
    "markdown": "treść w Markdown", 
    "html": "czysta treść HTML"
  },
  "sources": ["array linków źródłowych"],
  "metadata": {
    "timestamp": "ISO timestamp",
    "version": "1.0.3",
    "userAgent": "string przeglądarki",
    "url": "URL strony Google"
  }
}
```

## 🛠️ Implementacja techniczna

### Content Security Policy
• **Brak `eval()`** - kod nie używa eval ani podobnych funkcji
• **Inline scripts** - wszystkie skrypty w osobnych plikach
• **XSS protection** - input sanitization dla URL webhook'a

### Network requests
• **Tylko webhook'i** - żadne inne połączenia sieciowe
• **User consent** - wymagana świadoma konfiguracja przez użytkownika
• **No tracking** - brak analytics, telemetrii, tracking'u

### DOM manipulation
• **Read-only na Google** - rozszerzenie tylko czyta treść AI Overview
• **Injection safety** - bezpieczne wstrzykiwanie UI (createElement, nie innerHTML)
• **Clean up** - poprawne usuwanie event listenerów

## 🧪 Testing i weryfikacja

### Funkcjonalność bez webhook'ów
• **Core features** - działają identycznie jak w v1.0.2
• **Copy/download** - bez zmian w podstawowej funkcjonalności
• **UI/UX** - dodana sekcja webhook'ów w modal'u (domyślnie ukryta)

### Test webhook'ów
• **Test endpoint:** https://httpbin.org/post (bezpieczny test service)
• **Local test:** http://localhost:3000/webhook (dla dev)
• **Error cases:** niepoprawny URL, timeout, network error

### Kompatybilność
• **Firefox Manifest V3** - pełna zgodność
• **Extension ID** - wymagane `browser_specific_settings.gecko.id`
• **Permissions model** - zgodnie z Firefox guidelines

## 📋 Checklist dla recenzentów

✅ **Manifest.json** - sprawdzić browser_specific_settings i uprawnienie storage  
✅ **Webhook'i opcjonalne** - domyślnie wyłączone, wymagana konfiguracja  
✅ **HTTPS validation** - tylko bezpieczne połączenia (+ localhost)  
✅ **Input sanitization** - webhook URL jest walidowany  
✅ **No external requests** - oprócz opcjonalnych webhook'ów  
✅ **Privacy policy** - zaktualizowana o webhook'i w docs/  
✅ **Error handling** - timeout, network errors, invalid responses  
✅ **UI/UX** - webhook UI tylko po kliknięciu "Konfiguracja"  

## 📧 Kontakt
• **Developer:** Roman Rozenberger (roman@rozenberger.com)
• **GitHub:** https://github.com/romek-rozen/ai-overview-extractor
• **Dokumentacja:** Kompletna w folderze `docs/`
