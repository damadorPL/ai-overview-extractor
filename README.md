# AI Overview Extractor - Firefox Extension

🔍 **Ekstraktuj treść AI Overview z Google Search do formatu Markdown**

Wtyczka automatycznie wykrywa AI Overview na stronach wyników Google i umożliwia wyeksportowanie treści wraz ze źródłami do czytelnego formatu Markdown.

## 🚀 Funkcje

- ✅ **Automatyczne wykrywanie** AI Overview na Google Search
- 📋 **Ekstrakcja treści** do formatu Markdown
- 🔗 **Wyciąganie źródeł** z oczyszczonymi URLami  
- 🧹 **Usuwanie błędów** i komunikatów systemowych
- 💾 **Kopiowanie** do schowka jednym klikiem
- 📥 **Pobieranie** jako plik .md
- 🎨 **Czytelny interfejs** z podglądem

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

1. **Wyszukaj** coś w Google (np. "kindergeld pomoc")
2. **Poczekaj** aż pojawi się AI Overview  
3. **Kliknij** przycisk "📋 Ekstraktuj do Markdown"
4. **Skopiuj** treść lub pobierz jako plik

## 📁 Struktura plików

```
ai-overview-extractor/
├── manifest.json      # Konfiguracja wtyczki
├── content.js         # Główny skrypt
├── styles.css         # Style interfejsu
├── README.md          # Ta dokumentacja
└── icons/            # Ikony wtyczki
    ├── icon-16.png
    ├── icon-32.png  
    ├── icon-48.png
    └── icon-96.png
```

## ⚙️ Wymagania

- **Firefox** 57+ (Firefox Quantum)
- **Strona**: `google.com/search` lub `google.pl/search`
- **Język**: Działa z polskim interfejsem Google

## 🔧 Konfiguracja

Wtyczka działa automatycznie na:
- `*://www.google.com/search*`
- `*://www.google.pl/search*`

Aby dodać inne domeny Google, edytuj sekcję `matches` w `manifest.json`:

```json
"matches": [
  "*://www.google.com/search*",
  "*://www.google.pl/search*",
  "*://www.google.de/search*"
]
```

## 🐛 Rozwiązywanie problemów

### Przycisk nie pojawia się
- Sprawdź czy na stronie rzeczywiście jest AI Overview
- Otwórz konsolę (F12) i poszukaj logów `[AI Overview Extractor]`
- Odśwież stronę

### Brak treści w markdown
- AI Overview może nie być w pełni załadowane
- Spróbuj ponownie po kilku sekundach
- Sprawdź logi w konsoli

### Błąd kopiowania
- Sprawdź czy przeglądarka ma uprawnienia do schowka
- Spróbuj pobrać plik zamiast kopiować

## 🔄 Aktualizacje

Aby zaktualizować wtyczkę:
1. Pobierz nowe pliki
2. Zastąp stare pliki w folderze wtyczki  
3. Wejdź na `about:debugging`
4. Kliknij "Przeładuj" przy wtyczce

## 📝 Changelog

### v1.0.0
- ✨ Pierwsza wersja
- 📋 Ekstrakcja AI Overview do Markdown
- 🔗 Wyciąganie źródeł z linkami
- 💾 Kopiowanie i pobieranie
- 🎨 Interfejs użytkownika

## 🤝 Współpraca

Projekt jest open source! Możesz:
- 🐛 **Zgłaszać błędy** przez Issues
- 💡 **Proponować funkcje** 
- 🔧 **Wysyłać Pull Requesty**
- ⭐ **Oznaczać gwiazdką** jeśli podoba Ci się projekt

## 📄 Licencja

MIT License - możesz używać, modyfikować i dystrybuować za darmo.

## 🙋‍♂️ Autor

Stworzono z ❤️ dla społeczności SEO i marketingu cyfrowego.

---

**Przydatne? Zostaw ⭐ i podziel się z innymi!**