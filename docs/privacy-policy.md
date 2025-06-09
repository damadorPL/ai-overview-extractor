# Polityka Prywatności
## AI Overview Extractor - Rozszerzenie Chrome
**Ostatnia aktualizacja:** 6 czerwca 2025 
**Wersja rozszerzenia:** 1.0.3
## 1\. Wprowadzenie
 AI Overview Extractor to rozszerzenie przeglądarki Chrome zaprojektowane wyłącznie do ekstraktowania treści AI Overview z Google Search i konwersji jej do formatu Markdown. Niniejsza polityka prywatności wyjaśnia, jak rozszerzenie przetwarza dane i chroni prywatność użytkowników.
## 2\. Zbieranie danych
**AI Overview Extractor NIE ZBIERA, NIE PRZECHOWUJE ANI NIE PRZESYŁA żadnych danych osobowych.** 
Rozszerzenie:
* Nie zbiera informacji osobistych użytkowników
* Nie śledzi aktywności użytkowników
* Nie przechowuje historii wyszukiwań
* Nie gromadzi danych analitycznych
* Nie używa plików cookies
* Nie tworzy profili użytkowników
## 3\. Przetwarzanie danych
Rozszerzenie przetwarza wyłącznie:
* **Treść AI Overview** \- widoczną na stronie Google Search
* **Linki źródłowe** \- zawarte w AI Overview
* **Strukturę HTML** \- do konwersji na format Markdown
**Wszystkie operacje wykonywane są lokalnie w przeglądarce użytkownika.**
## 4\. Przechowywanie danych
* Rozszerzenie nie przechowuje żadnych danych na stałe
* Skonwertowana treść istnieje tylko tymczasowo w pamięci przeglądarki
* Po zamknięciu karty wszystkie dane są automatycznie usuwane
* Nie ma lokalnej bazy danych ani plików konfiguracyjnych
## 5\. Komunikacja sieciowa
Rozszerzenie domyślnie:
* Nie nawiązuje połączeń z zewnętrznymi serwerami
* Nie wysyła danych do deweloperów
* Nie komunikuje się z usługami analitycznymi
* Działa wyłącznie w kontekście strony Google Search

### Webhook'i (funkcja opcjonalna)
**Od wersji 1.0.3** rozszerzenie oferuje opcjonalną funkcję webhook'ów:
* **Wymaga świadomej konfiguracji** - funkcja jest wyłączona domyślnie
* **Kontrola użytkownika** - użytkownik sam decyduje czy i gdzie wysyłać dane
* **Przejrzystość** - jasne informacje o wysyłanych danych
* **Bezpieczeństwo** - wymaganie HTTPS dla webhook'ów
* **Brak śledzenia** - rozszerzenie nie monitoruje używania webhook'ów

**Dane wysyłane przez webhook'i (tylko jeśli skonfigurowane):**
* Treść AI Overview w formacie Markdown i HTML
* Lista źródeł z AI Overview
* Słowo kluczowe wyszukiwania
* URL strony Google Search
* Timestamp ekstrakcji
* Wersja rozszerzenia
* User Agent przeglądarki

**Ważne:** Webhook'i wysyłają dane do serwerów konfigurowanych przez użytkownika. Rozszerzenie nie kontroluje ani nie monitoruje tych serwerów.
## 6\. Uprawnienia i ich użycie
### activeTab
Używane wyłącznie do:
* Odczytu treści AI Overview z aktywnej karty
* Wstrzykiwania przycisku interfejsu użytkownika
* Obserwowania zmian DOM dla wykrywania AI Overview
### host\_permissions (google.com)
Umożliwia działanie rozszerzenia na stronach Google Search:
* Ograniczone wyłącznie do domeny google.com
* Nie daje dostępu do innych stron internetowych
* Minimalizuje powierzchnię ataku

### storage
**Nowe w wersji 1.0.3** - używane wyłącznie do:
* Przechowywania URL webhook'a (jeśli skonfigurowany przez użytkownika)
* Lokalne przechowywanie w chrome.storage.local
* Brak synchronizacji z innymi urządzeniami
* Dane nie są wysyłane do deweloperów
## 7\. Bezpieczeństwo
* Kod rozszerzenia działa w izolowanym środowisku przeglądarki
* Brak połączeń z zewnętrznymi serwerami
* Minimalne uprawnienia zgodnie z zasadą najmniejszych uprawnień
* Regularne aktualizacje bezpieczeństwa
* Kod źródłowy dostępny publicznie na GitHub
## 8\. Biblioteki zewnętrzne
Rozszerzenie używa biblioteki **turndown.js**:
* Dołączona lokalnie do rozszerzenia
* Nie pobiera danych z zewnętrznych źródeł
* Używana wyłącznie do konwersji HTML na Markdown
* Kod statyczny, nie zmienia się po instalacji
## 9\. Prawa użytkowników
Ponieważ rozszerzenie nie zbiera danych osobowych, nie ma danych do:
* Udostępnienia
* Poprawiania
* Usuwania
* Przenoszenia
## 10\. Zmiany w polityce prywatności
 O wszelkich istotnych zmianach w polityce prywatności użytkownicy będą informowani poprzez:
* Aktualizację rozszerzenia
* Powiadomienie w opisie aktualizacji
* Aktualizację tej strony
## 11\. Zgodność z przepisami
Rozszerzenie jest zgodne z:
* **RODO (GDPR)** \- nie przetwarza danych osobowych
* **CCPA** \- nie sprzedaje danych osobowych
* **Zasadami Chrome Web Store** \- minimalne uprawnienia, jeden cel
## 12\. Kontakt
W przypadku pytań dotyczących prywatności:
* **Email:** roman@rozenberger.com
* **GitHub:** <https://github.com/romek-rozen/ai-overview-extractor>
* **Autor:** Roman Rozenberger
## 13\. Podsumowanie
**AI Overview Extractor to narzędzie skupione na prywatności:**
* Zero zbierania danych osobowych
* Wszystkie operacje lokalne
* Brak komunikacji sieciowej
* Minimalne uprawnienia
* Jeden, jasno zdefiniowany cel
---
**AI Overview Extractor v1.0.3** 
 Autor: Roman Rozenberger 
 Ostatnia aktualizacja polityki: 6 czerwca 2025
