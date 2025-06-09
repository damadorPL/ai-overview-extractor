# Uwagi do wydania v1.0.3 - dla użytkowników

## 🚀 Nowości w wersji 1.0.3

### Webhook'i - automatyzacja workflow
• **Nowa funkcja:** Automatyczne wysyłanie ekstraktowanych danych do zewnętrznych systemów
• **Konfiguracja:** Łatwe ustawienie URL webhook'a w interfejsie rozszerzenia
• **Test połączenia:** Sprawdzenie czy webhook działa przed zapisaniem
• **Bezpieczeństwo:** Wymaganie HTTPS (oprócz localhost do testów)

### Ulepszona jakość treści
• **Czysta treść:** Automatyczne usuwanie elementów CSS i JavaScript z ekstraktowanej treści
• **Lepsze formatowanie:** Usunięcie niepotrzebnych atrybutów Google z linków
• **Szybsza praca:** Optymalizacje wydajności dla większych treści AI Overview

### Dla deweloperów i automatyzacji
• **JSON API:** Standardowy format danych wysyłanych przez webhook'i
• **Metadane:** Timestamp, wersja rozszerzenia, User Agent w każdym webhook'u
• **Error handling:** Informacje o błędach połączenia z timeout 5 sekund

## 🔒 Prywatność i bezpieczeństwo
• **Opcjonalność:** Webhook'i są domyślnie wyłączone - musisz je świadomie skonfigurować
• **Lokalne przechowywanie:** Konfiguracja webhook'a zapisana tylko w twojej przeglądarce
• **Transparentność:** Jasne informacje o tym, jakie dane są wysyłane
• **Kontrola użytkownika:** Pełna kontrola nad tym, gdzie i kiedy wysyłać dane

## ⚡ Kompatybilność
• **Pełna zgodność wsteczna:** Wszystkie poprzednie funkcje działają bez zmian
• **Firefox Manifest V3:** Kompatybilność z najnowszymi standardami
• **Bez breaking changes:** Aktualizacja nie wpłynie na obecny sposób użytkowania

---

**Jak używać webhook'ów:**
1. Kliknij przycisk "Ekstraktuj do Markdown" przy AI Overview
2. W modal'u kliknij "Konfiguracja webhook'ów"
3. Wpisz URL swojego API i kliknij "Test"
4. Po pomyślnym teście kliknij "Zapisz"
5. Od teraz dane będą automatycznie wysyłane do twojego systemu!
