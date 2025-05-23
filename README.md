# AI Overview Extractor - Browser Extension

🔍 **Ekstraktuj treść AI Overview z Google Search do formatu Markdown**

Rozszerzenie automatycznie wykrywa AI Overview na stronach wyników Google i umożliwia wyeksportowanie treści wraz ze źródłami do czytelnego formatu Markdown.

![Demonstracja działania wtyczki](./images/ai-overviews-extractor.gif)

## 🚀 Funkcje

- ✅ **Automatyczne wykrywanie** AI Overview na Google Search (kontener `#m-x-content`)
- 📋 **Ekstrakcja treści** do formatu Markdown z użyciem biblioteki TurndownService
- 🧹 **Zaawansowane czyszczenie** - usuwa elementy MSC, ukryte elementy i błędy systemowe
- 🔍 **Automatyczne wyciąganie** słowa kluczowego z wyszukiwania
- 🔗 **Wyciąganie źródeł** z oczyszczonymi URLami Google
- 💾 **Kopiowanie** do schowka jednym klikiem
- 📥 **Pobieranie** jako plik .md z timestampem
- 🎨 **Czytelny interfejs** z podglądem i powiadomieniami
- 🔄 **Obserwator DOM** - automatyczne dodawanie przycisku przy nowych wynikach

## 📦 Instalacja

### Metoda 1: Chrome/Chromium - Tryb deweloperski

1. **Pobierz pliki** - skopiuj wszystkie pliki do folderu `ai-overview-extractor/`
2. **Otwórz Chrome** i przejdź do `chrome://extensions/`
3. **Włącz** "Tryb dewelopera" (przełącznik w prawym górnym rogu)
4. **Kliknij** "Wczytaj rozpakowane rozszerzenie"
5. **Wybierz** folder `ai-overview-extractor/`
6. **Gotowe!** Rozszerzenie zostanie załadowane

### Metoda 2: Firefox - Tryb deweloperski

1. **Pobierz pliki** - skopiuj wszystkie pliki do folderu `ai-overview-extractor/`
2. **Otwórz Firefox** i przejdź do `about:debugging`
3. **Kliknij** "Ten Firefox" w menu po lewej
4. **Kliknij** "Wczytaj tymczasowy dodatek..."
5. **Wybierz** plik `manifest.json` z folderu rozszerzenia
6. **Gotowe!** Rozszerzenie zostanie załadowane

### Metoda 3: Firefox - Instalacja stała

1. Wejdź na `about:config` w Firefox
2. Znajdź `xpinstall.signatures.required` i ustaw na `false`
3. Spakuj folder rozszerzenia do pliku `.zip`
4. Zmień rozszerzenie na `.xpi`
5. Przeciągnij plik `.xpi` do Firefox

## 🎯 Użytkowanie

1. **Wyszukaj** coś w Google (np. "cukrzyca")
2. **Poczekaj** aż pojawi się AI Overview  
3. **Kliknij** przycisk "📋 Ekstraktuj do Markdown"
4. **Skopiuj** treść lub pobierz jako plik

## 📁 Struktura plików

```
ai-overview-extractor/
├── manifest.json      # Konfiguracja rozszerzenia (Manifest V3)
├── styles.css         # Style interfejsu użytkownika
├── README.md          # Ta dokumentacja
├── LICENCE            # Licencja MIT
├── .gitignore         # Pliki ignorowane przez Git
├── src/              # Pliki źródłowe
│   ├── content.js     # Główny skrypt z klasą AIOverviewExtractor
│   └── turndown.js    # Biblioteka konwersji HTML→Markdown
├── icons/            # Ikony rozszerzenia
│   ├── icon-16.png
│   ├── icon-32.png  
│   ├── icon-48.png
│   ├── icon-96.png
│   └── icon-128.png
├── images/           # Obrazy dokumentacji
│   ├── ai-overviews-extractor.gif
│   ├── ai-overview-extractor-001.jpg
│   └── ai_overviews_extractor_logo.png
└── docs/             # Dokumentacja dodatkowa
    ├── chrome-web-store-checklist.md
    ├── chrome-web-store-description.md
    ├── chrome-web-store-privacy-justifications.md
    └── privacy-policy.html
```

## ⚙️ Wymagania

- **Chrome/Chromium** (najnowsza wersja) lub **Firefox** 58+ (Firefox Quantum)
- **Manifest V3** - nowoczesny standard rozszerzeń
- **Strona**: `google.com/search`
- **Język**: Działa z polskim interfejsem Google
- **Uprawnienia**: `activeTab`, `host_permissions: *://www.google.com/*`

## 🔧 Konfiguracja

Rozszerzenie działa automatycznie na:
- `*://www.google.com/search*`

Aby dodać inne domeny Google, edytuj sekcję `content_scripts.matches` w `manifest.json`:

```json
"content_scripts": [
  {
    "matches": [
      "*://www.google.com/search*",
      "*://www.google.pl/search*",
      "*://www.google.de/search*"
    ],
    "js": ["src/turndown.js", "src/content.js"],
    "css": ["styles.css"],
    "run_at": "document_end"
  }
]
```

## 🔍 Jak działa

### Wykrywanie AI Overview
- Szuka kontenera `#m-x-content` na stronie
- Używa `MutationObserver` do monitorowania zmian DOM
- Automatycznie dodaje przycisk gdy znajdzie kontener

### Ekstrakcja treści
- Usuwa elementy z `data-subtree="msc"` (elementy MSC)
- Usuwa elementy z `style="display:none"` (ukryte elementy)
- Usuwa kontener źródeł przed konwersją
- Konwertuje HTML na Markdown używając TurndownService

### Wyciąganie źródeł
- Znajduje kontener źródeł `div[style="height: 100%;"]`
- Ekstraktuje linki z widocznej listy `ul[class]`
- Czyści URL-e Google (usuwa `/url?` wrappery)
- Filtruje duplikaty i nieprawidłowe linki

## 🐛 Rozwiązywanie problemów

### Przycisk nie pojawia się
- Sprawdź czy na stronie rzeczywiście jest AI Overview
- Otwórz konsolę (F12) i poszukaj logów `[AI Overview Extractor]`
- Sprawdź czy istnieje element `#m-x-content`
- Odśwież stronę i poczekaj na pełne załadowanie

### Brak treści w markdown
- AI Overview może nie być w pełni załadowane
- Spróbuj ponownie po kilku sekundach
- Sprawdź logi w konsoli - powinny pokazać proces ekstrakcji
- Sprawdź czy nie ma błędów JavaScript

### Błąd kopiowania
- Sprawdź czy przeglądarka ma uprawnienia do schowka
- Spróbuj pobrać plik zamiast kopiować
- Sprawdź czy strona jest serwowana przez HTTPS

### Problemy z źródłami
- Sprawdź w konsoli logi dotyczące znalezionych linków
- Niektóre źródła mogą być filtrowane (Google, support itp.)
- URL-e są automatycznie czyszczone z wrapperów Google

## 🔄 Aktualizacje

Aby zaktualizować rozszerzenie:

**Chrome/Chromium:**
1. Pobierz nowe pliki
2. Zastąp stare pliki w folderze rozszerzenia
3. Wejdź na `chrome://extensions/`
4. Kliknij "Przeładuj" przy rozszerzeniu

**Firefox:**
1. Pobierz nowe pliki
2. Zastąp stare pliki w folderze rozszerzenia
3. Wejdź na `about:debugging`
4. Kliknij "Przeładuj" przy rozszerzeniu

## 📝 Changelog

### v1.0.2 (aktualna)
- 🔧 Poprawki stabilności i kompatybilności
- 📱 Wsparcie dla Manifest V3
- 🌐 Kompatybilność z Chrome i Firefox

### v1.0.1
- 🐛 Poprawki błędów w ekstrakcji źródeł
- ⚡ Optymalizacja wydajności
- 🔍 Ulepszone wykrywanie AI Overview

### v1.0.0
- ✨ Pierwsza wersja
- 📋 Ekstrakcja AI Overview do Markdown z TurndownService
- 🔗 Wyciąganie źródeł z czyszczeniem URL-i Google
- 🧹 Zaawansowane filtrowanie treści (MSC, ukryte elementy)
- 💾 Kopiowanie i pobieranie z timestampem
- 🎨 Interfejs użytkownika z powiadomieniami
- 🔄 Obserwator DOM dla dynamicznych zmian

## 🤝 Współpraca

Projekt jest open source! Możesz:
- 🐛 **Zgłaszać błędy** przez Issues na GitHub
- 💡 **Proponować funkcje** 
- 🔧 **Wysyłać Pull Requesty**
- ⭐ **Oznaczać gwiazdką** jeśli podoba Ci się projekt

**GitHub:** https://github.com/romek-rozen/ai-overview-extractor

## 👨‍💻 Autor

**Roman Rozenberger**
- GitHub: https://github.com/romek-rozen
- Www: https://rozenberger.com

## 📄 Licencja

MIT License - możesz używać, modyfikować i dystrybuować za darmo.

---

**Przydatne? Zostaw ⭐ i podziel się z innymi!**

Stworzono z ❤️ dla społeczności SEO i marketingu cyfrowego.
