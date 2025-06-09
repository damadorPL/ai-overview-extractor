# n8n Workflow Template - AI Overview Extractor

🚀 **Gotowy workflow n8n do kompleksowej automatyzacji AI Overview z wtyczką przeglądarki**

Ten template zawiera kompletny workflow n8n który współpracuje z rozszerzeniem AI Overview Extractor do automatycznego przetwarzania i analizy danych AI Overview.

## 📋 Co robi ten workflow?

### 🔄 Główne funkcje:
1. **Webhook endpoint** - odbiera dane z wtyczki przeglądarki
2. **Przetwarzanie HTML→Markdown** - automatyczna konwersja treści
3. **Zapis do Google Sheets** - archiwizacja wszystkich AI Overview
4. **AI Guidelines Generator** - LLM analizuje i generuje wytyczne SEO
5. **Batch processing** - analiza wielu stron z arkusza Google
6. **Scheduler** - automatyczne uruchamianie co 15 minut

### 📊 Przepływ danych:
```
Wtyczka → Webhook → Przetwarzanie → Google Sheets → AI Analiza → Wytyczne SEO
```

## 🛠️ Instalacja

### Krok 1: Import workflow
1. **Otwórz n8n** (lokalnie `http://localhost:5678` lub w chmurze)
2. **Przejdź do:** Menu → `Workflows` → `Add workflow` → `Import from JSON`
3. **Załaduj plik:** `AI_Overviews_Extractor_Plugin.json`
4. **Zapisz workflow**

### Krok 2: Konfiguracja Google Sheets
1. **Utwórz Google Sheet** z kolumnami:
   ```
   extractedAt | searchQuery | sources | markdown | myURL | task | guidelines | key | row_number
   ```
2. **W n8n dodaj Google Sheets credential:**
   - Przejdź do: `Settings` → `Credentials` → `Add credential`
   - Wybierz: `Google Sheets OAuth2 API`
   - Autoryzuj dostęp do Google
3. **Ustaw URL arkusza** w węzłach:
   - `getRows`
   - `updateRows` 
   - `updateGuideLines`

### Krok 3: Konfiguracja LLM (OpenRouter)
1. **Zarejestruj się w OpenRouter:** https://openrouter.ai/
2. **Wygeneruj klucz API**
3. **W n8n dodaj OpenRouter credential:**
   - `Settings` → `Credentials` → `Add credential`
   - Wybierz: `OpenRouter API`
   - Wklej klucz API
4. **Przypisz credential** do węzła `OpenRouter Chat Model`

### Krok 4: Aktywacja
1. **Ustaw webhook URL** - skopiuj z węzła `Webhook`
2. **Aktywuj workflow** - przełącznik w prawym górnym rogu
3. **Test webhook** - powinien odpowiadać na porcie 5678

## ⚙️ Konfiguracja wtyczki

### URL webhook:
```
http://localhost:5678/webhook/ai-overview-extractor
```

### Test połączenia:
1. W wtyczce wklej URL webhook
2. Kliknij "🧪 Test" 
3. Powinno pokazać: ✅ Test połączenia udany

## 📁 Struktura workflow

### Triggery:
- **Webhook** - dla danych z wtyczki
- **Manual Trigger** - ręczne uruchomienie
- **Schedule Trigger** - automatycznie co 15 minut

### Główne węzły:
1. **data** (Set) - ekstrakcja danych z webhook payload
2. **Markdown** - konwersja HTML na markdown
3. **updateRows** (Google Sheets) - zapis danych AI Overview
4. **getRows** (Google Sheets) - pobieranie zadań do analizy
5. **getPage** (HTTP Request) - pobieranie treści stron
6. **Basic LLM Chain** - generowanie wytycznych AI
7. **updateGuideLines** (Google Sheets) - zapis wytycznych

### Pomocnicze węzły:
- **Limit** - ograniczenie do 10 rekordów na raz
- **myURL Exists** (Filter) - filtrowanie rekordów z URL
- **loopOverRows** (Split in Batches) - przetwarzanie batch'ami
- **Wait** - opóźnienie między requests
- **HTML** - ekstrakcja metadanych ze stron

## 🎯 Jak używać

### 1. Podstawowe użycie (Webhook):
1. **Wyszukaj w Google** coś z AI Overview
2. **Użyj wtyczki** - kliknij "📋 Ekstraktuj do Markdown"
3. **Wyślij webhook** - kliknij "🚀 Wyślij webhook"
4. **Sprawdź arkusz** - dane powinny się pojawić automatycznie

### 2. Batch analiza (Manual/Scheduler):
1. **W arkuszu Google dodaj:**
   - Kolumna `myURL`: URL stron do analizy
   - Kolumna `task`: wartość "create guidelines"
2. **Uruchom workflow** ręcznie lub poczekaj na scheduler
3. **Sprawdź kolumnę `guidelines`** - AI wygeneruje wytyczne SEO

### 3. Automatyzacja:
- **Scheduler** działa co 15 minut
- **Analizuje max 10 rekordów** na raz
- **Pomija już przetworzone** (z wypełnioną kolumną `guidelines`)

## 🔧 Dostosowanie

### Zmiana modelu AI:
```json
// W węźle OpenRouter Chat Model zmień:
"model": "google/gemini-2.5-flash-preview-05-20"
// Na inny model np.:
"model": "anthropic/claude-3.5-sonnet"
"model": "openai/gpt-4o"
```

### Zmiana interwału schedulera:
```json
// W węźle Schedule Trigger zmień:
"interval": [{"field": "minutes", "minutesInterval": 15}]
// Na inny interwał np.:
"interval": [{"field": "hours", "hoursInterval": 1}]
```

### Dostosowanie promptu AI:
W węźle `Basic LLM Chain` możesz zmienić prompt systemowy aby AI generowało inne typy analiz.

## 🔍 Rozwiązywanie problemów

### Webhook nie działa:
- Sprawdź czy n8n jest uruchomione na porcie 5678
- Upewnij się że workflow jest aktywny
- Sprawdź logi n8n w konsoli

### Google Sheets błędy:
- Sprawdź czy credential jest poprawnie skonfigurowany
- Upewnij się że arkusz ma odpowiednie kolumny
- Sprawdź uprawnienia do arkusza

### OpenRouter błędy:
- Sprawdź czy masz wystarczające środki na koncie
- Upewnij się że klucz API jest aktywny
- Sprawdź czy wybrany model jest dostępny

### Timeout błędy:
- Zwiększ timeout w węźle `Wait` jeśli strony ładują się wolno
- Zmniejsz liczbę w węźle `Limit` jeśli przetwarzanie jest zbyt wolne

## 📊 Monitoring

### Logi n8n:
- Sprawdzaj wykonania w sekcji `Executions`
- Analizuj błędy w poszczególnych węzłach
- Monitoruj zużycie API calls

### Google Sheets metryki:
- Liczba przetworzonych AI Overview
- Czas generowania wytycznych
- Skuteczność różnych modeli AI

## 💡 Wskazówki

### Optymalizacja:
- Używaj `Limit` aby nie przeciążać API
- Dodaj `Wait` między requests aby uniknąć rate limitów
- Regularnie czyść stare dane w arkuszu

### Bezpieczeństwo:
- Chroń klucze API (nie udostępniaj workflow z kluczami)
- Używaj HTTPS dla webhook'ów w produkcji
- Ograniczaj dostęp do Google Sheets

### Skalowanie:
- Uruchom n8n w chmurze dla większej niezawodności
- Używaj baz danych zamiast Google Sheets dla większych volumenów
- Rozważ cache'owanie wyników AI

## 📈 Przypadki użycia

### SEO Agency:
- Monitorowanie AI Overview dla klientów
- Automatyczne generowanie raportów SEO
- Śledzenie zmian w SERP

### Content Marketing:
- Analiza trendów w AI Overview
- Inspiracja do nowej treści
- Optymalizacja istniejących artykułów

### E-commerce:
- Monitoring AI Overview dla produktów
- Analiza konkurencji
- Optymalizacja opisów produktów

## 🔄 Aktualizacje

Ten template jest regularnie aktualizowany. Aby otrzymać najnowszą wersję:

1. Sprawdź GitHub repo: https://github.com/romek-rozen/ai-overview-extractor
2. Porównaj z aktualnym workflow
3. Zastąp stary template nowym
4. Zrekonfiguruj credentials jeśli potrzeba

## 🤝 Wsparcie

Potrzebujesz pomocy? Sprawdź:
- **GitHub Issues:** https://github.com/romek-rozen/ai-overview-extractor/issues
- **n8n Community:** https://community.n8n.io/
- **Dokumentacja n8n:** https://docs.n8n.io/

---

**Stworzone z ❤️ dla automatyzacji AI Overview**
