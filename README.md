# AI Overview Extractor - Firefox Extension

🔍 **Ekstraktuj treść AI Overview z Google Search do formatu Markdown**

Wtyczka automatycznie wykrywa AI Overview na stronach wyników Google i umożliwia wyeksportowanie treści wraz ze źródłami do czytelnego formatu Markdown.

![Demonstracja działania wtyczki](ai-overviews-extractor.gif)

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

### Metoda 1: Instalacja z plików źródłowych

1. **Pobierz pliki** - skopiuj wszystkie pliki do folderu `ai-overview-extractor/`
2. **Otwórz Firefox** i przejdź do `about:debugging`
3. **Kliknij** "Ten Firefox" w menu po lewej
4. **Kliknij** "Wczytaj tymczasowy dodatek..."
5. **Wybierz** plik `manifest.json` z folderu wtyczki
6. **Gotowe!** Wtyczka zostanie załadowana

### Metoda 2: Tryb deweloperski (stały)

1. Wejdź na `about:config` w Firefox
2. Znajdź `xpinstall.signatures.required` i ustaw na `false`
3. Spakuj folder wtyczki do pliku `.zip`
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
├── manifest.json      # Konfiguracja wtyczki
├── content.js         # Główny skrypt z klasą AIOverviewExtractor
├── turndown.js        # Biblioteka konwersji HTML→Markdown
├── styles.css         # Style interfejsu użytkownika
├── README.md          # Ta dokumentacja
└── icons/            # Ikony wtyczki
    ├── icon-16.png
    ├── icon-32.png  
    ├── icon-48.png
    └── icon-96.png
```

## ⚙️ Wymagania

- **Firefox** 58+ (Firefox Quantum)
- **Strona**: `google.com/search`
- **Język**: Działa z polskim interfejsem Google
- **Uprawnienia**: `activeTab`, `*://www.google.com/*`

## 🔧 Konfiguracja

Wtyczka działa automatycznie na:
- `*://www.google.com/search*`

Aby dodać inne domeny Google, edytuj sekcję `matches` w `manifest.json`:

```json
"matches": [
  "*://www.google.com/search*",
  "*://www.google.pl/search*",
  "*://www.google.de/search*"
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

Aby zaktualizować wtyczkę:
1. Pobierz nowe pliki
2. Zastąp stare pliki w folderze wtyczki  
3. Wejdź na `about:debugging`
4. Kliknij "Przeładuj" przy wtyczce

## 📝 Changelog

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
