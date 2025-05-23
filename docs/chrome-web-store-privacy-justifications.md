# Chrome Web Store - Uzasadnienia uprawnień i polityka prywatności

## Uzasadnienie uprawnień activeTab

**Dlaczego potrzebujemy uprawnienia activeTab:**
Rozszerzenie AI Overview Extractor wymaga dostępu do aktywnej karty, aby:

1. **Wykrywać AI Overview** - Musi przeskanować DOM strony Google Search w poszukiwaniu kontenera AI Overview (`#m-x-content`)
2. **Wstrzykiwać przycisk interfejsu** - Dodaje przycisk "Ekstraktuj do Markdown" w odpowiednim miejscu na stronie
3. **Ekstraktować treść** - Odczytuje zawartość AI Overview i konwertuje ją do formatu Markdown
4. **Obserwować zmiany DOM** - Używa MutationObserver do wykrywania dynamicznie ładowanych AI Overview

**Bezpieczeństwo:** Uprawnienie activeTab jest najbezpieczniejszą opcją, ponieważ działa tylko gdy użytkownik aktywnie korzysta z karty i nie daje dostępu do innych kart.

## Uzasadnienie uprawnień dotyczących hosta (*://www.google.com/*)

**Dlaczego potrzebujemy dostępu do google.com:**
Rozszerzenie jest specjalnie zaprojektowane do pracy wyłącznie z Google Search:

1. **Specjalizacja** - AI Overview występuje tylko na stronach wyników wyszukiwania Google
2. **Wykrywanie treści** - Musi analizować strukturę HTML specyficzną dla Google Search
3. **Bezpieczeństwo** - Ograniczenie tylko do google.com minimalizuje powierzchnię ataku
4. **Funkcjonalność** - Bez dostępu do google.com rozszerzenie nie może działać zgodnie z przeznaczeniem

**Minimalizacja uprawnień:** Używamy najwęższego możliwego zakresu - tylko google.com, nie wszystkie strony internetowe.

## Uzasadnienie użycia kodu zdalnego (turndown.js)

**Dlaczego używamy biblioteki turndown.js:**
1. **Konwersja HTML→Markdown** - Profesjonalna biblioteka do konwersji HTML na Markdown
2. **Stabilność** - Sprawdzona biblioteka z wieloletnią historią rozwoju
3. **Bezpieczeństwo** - Kod biblioteki jest statyczny, nie wykonuje żadnych połączeń sieciowych
4. **Funkcjonalność** - Zapewnia prawidłowe formatowanie Markdown z zachowaniem struktury

**Bezpieczeństwo kodu:**
- Biblioteka turndown.js jest dołączona lokalnie do rozszerzenia
- Nie pobiera żadnych danych z zewnętrznych serwerów
- Kod jest statyczny i nie zmienia się po instalacji
- Używana wyłącznie do konwersji tekstu HTML na Markdown

## Opis jednego celu (Single Purpose Description)

**Główny cel rozszerzenia:**
AI Overview Extractor ma jeden, jasno zdefiniowany cel: **ekstraktowanie treści AI Overview z Google Search do formatu Markdown**.

**Szczegółowy opis celu:**
- Automatyczne wykrywanie AI Overview na stronach Google Search
- Konwersja treści HTML AI Overview do czytelnego formatu Markdown
- Wyciąganie i czyszczenie linków źródłowych
- Umożliwienie kopiowania lub pobierania skonwertowanej treści

**Dlaczego to jeden cel:**
Wszystkie funkcje rozszerzenia służą jednemu celowi - przekształceniu AI Overview w format Markdown. Nie ma żadnych dodatkowych funkcji niezwiązanych z tym głównym zadaniem.

## Polityka prywatności

### Zbieranie danych
AI Overview Extractor **NIE ZBIERA, NIE PRZECHOWUJE ANI NIE PRZESYŁA** żadnych danych osobowych lub informacji o użytkownikach.

### Przetwarzanie danych
- Rozszerzenie przetwarza wyłącznie treść AI Overview widoczną na stronie Google Search
- Wszystkie operacje wykonywane są lokalnie w przeglądarce użytkownika
- Żadne dane nie są wysyłane do zewnętrznych serwerów
- Nie ma komunikacji sieciowej poza standardowym działaniem strony Google

### Przechowywanie danych
- Rozszerzenie nie przechowuje żadnych danych na stałe
- Skonwertowana treść istnieje tylko tymczasowo w pamięci przeglądarki
- Po zamknięciu karty wszystkie dane są automatycznie usuwane

### Uprawnienia i ich użycie
- **activeTab**: Używane wyłącznie do odczytu treści AI Overview z aktywnej karty
- **host_permissions (google.com)**: Umożliwia działanie rozszerzenia na stronach Google Search
- Żadne uprawnienia nie są używane do zbierania danych osobowych

### Bezpieczeństwo
- Kod rozszerzenia działa w izolowanym środowisku przeglądarki
- Brak połączeń z zewnętrznymi serwerami
- Minimalne uprawnienia zgodnie z zasadą najmniejszych uprawnień
- Regularnie aktualizowane dla zachowania bezpieczeństwa

### Kontakt
W przypadku pytań dotyczących prywatności:
- Email: [WYMAGANY ADRES EMAIL]
- GitHub: https://github.com/romek-rozen/ai-overview-extractor

### Zmiany w polityce
O wszelkich zmianach w polityce prywatności użytkownicy będą informowani poprzez aktualizację rozszerzenia.

---

**Data ostatniej aktualizacji:** 23 maja 2025
**Wersja rozszerzenia:** 1.0.2
