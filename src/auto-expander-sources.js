class AutoExpanderSources {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
        this.expansionCallbacks = [];
        this.isReady = false;
        console.log('[AutoExpanderSources] Initialized');
    }

    // Rejestruje callback wywoływany po rozwinięciu źródeł
    onExpansionComplete(callback) {
        this.expansionCallbacks.push(callback);
    }

    // Sygnalizuje że moduł może rozpocząć pracę (wywoływane przez AutoExpanderOverviews)
    setReady() {
        this.isReady = true;
        console.log('[AutoExpanderSources] Ready to expand sources');
    }

    // Główna metoda rozwijania źródeł
    async expandSources() {
        try {
            const settings = await this.settingsManager.getSettings();
            if (!settings.autoExpandSources) {
                console.log('[AutoExpanderSources] Auto-expand sources is disabled');
                return false;
            }

            // Czekaj aż pierwszy moduł da sygnał gotowości
            if (!this.isReady) {
                console.log('[AutoExpanderSources] Waiting for overview expansion...');
                await this.waitForReady();
            }

            // Dodatkowe opóźnienie na załadowanie sekcji źródeł
            await this.delay(500);

            // Sprawdź czy już rozwinięte
            if (this.areSourcesExpanded()) {
                console.log('[AutoExpanderSources] Sources already expanded');
                return true;
            }

            // Użyj uniwersalnej strategii rozwijania
            const success = await this.universalExpandSources();
            
            if (success) {
                console.log('[AutoExpanderSources] Sources expanded successfully');
                
                // Wywołaj wszystkie callbacki
                this.expansionCallbacks.forEach(callback => {
                    try {
                        callback();
                    } catch (error) {
                        console.error('[AutoExpanderSources] Error in expansion callback:', error);
                    }
                });
                
                return true;
            } else {
                console.log('[AutoExpanderSources] Failed to expand sources');
                return false;
            }
        } catch (error) {
            console.error('[AutoExpanderSources] Error in expandSources:', error);
            return false;
        }
    }

    // Uniwersalna strategia rozwijania źródeł
    async universalExpandSources() {
        const maxAttempts = 10; // 5 sekund (10 * 500ms)
        let attempt = 0;
        
        while (attempt < maxAttempts) {
            attempt++;
            console.log(`[AutoExpanderSources] Attempt ${attempt}/${maxAttempts}`);
            
            // Sprawdź czy już rozwinięte
            if (this.areSourcesExpanded()) {
                console.log('[AutoExpanderSources] Sources already expanded');
                return true;
            }
            
            // Znajdź sekcję MSC
            const mscSection = document.querySelector('div[data-subtree="msc"]');
            if (!mscSection) {
                console.log('[AutoExpanderSources] MSC section not found, retrying...');
                await this.delay(500);
                continue;
            }
            
            // Strategia 1: Znajdź przycisk w ostatnim <li> (stara metoda)
            let button = this.findExpandButtonInLastLi(mscSection);
            
            // Strategia 2: Fallback - szukaj przycisków z cursor:pointer (nowa metoda)
            if (!button) {
                console.log('[AutoExpanderSources] Trying fallback strategy...');
                button = this.findExpandButtonFallback();
            }
            
            if (!button) {
                console.log('[AutoExpanderSources] No expand button found with any strategy, retrying...');
                await this.delay(500);
                continue;
            }
            
            console.log('[AutoExpanderSources] Found button:', button);
            
            // Kliknij przycisk
            const success = await this.tryClickButton(button);
            if (success) {
                // Czekaj na rozwinięcie
                await this.delay(1000);
                
                // Sprawdź czy się rozwinęło
                if (this.areSourcesExpanded()) {
                    console.log('[AutoExpanderSources] Success! Sources expanded');
                    return true;
                }
            }
            
            await this.delay(500);
        }
        
        console.log('[AutoExpanderSources] Max attempts reached, giving up');
        return false;
    }
    
    
    // Próbuje kliknąć przycisk różnymi metodami
    async tryClickButton(button) {
        const methods = [
            () => button.click(),
            () => {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                button.dispatchEvent(event);
            },
            () => {
                button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            },
            () => {
                // Dla Google's jsaction
                const jsaction = button.getAttribute('jsaction');
                if (jsaction && jsaction.includes('trigger')) {
                    button.dispatchEvent(new Event('trigger', { bubbles: true }));
                }
            }
        ];
        
        for (const method of methods) {
            try {
                console.log('[AutoExpanderSources] Trying click method:', method.name || 'anonymous');
                method();
                await this.delay(200);
                return true;
            } catch (error) {
                console.log('[AutoExpanderSources] Click method failed:', error);
            }
        }
        
        return false;
    }
    
    // Liczy widoczne źródła w sekcji
    countVisibleSources(mscSection) {
        const links = mscSection.querySelectorAll('a[href]');
        const visibleLinks = Array.from(links).filter(link => this.isElementVisible(link));
        return visibleLinks.length;
    }
    
    // Sprawdza czy element jest widoczny
    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
    }

    // Znajduje przycisk rozwijania w ostatnim <li>
    findExpandButtonInLastLi(mscSection) {
        console.log('[AutoExpanderSources] Looking for expand button in last <li>');
        
        // Znajdź <ul> w sekcji MSC
        const ul = mscSection.querySelector('ul');
        if (!ul) {
            console.log('[AutoExpanderSources] No <ul> found in MSC section');
            return null;
        }
        
        // Pobierz ostatni <li>
        const lastLi = ul.lastElementChild;
        if (!lastLi || lastLi.tagName !== 'LI') {
            console.log('[AutoExpanderSources] No valid last <li> found');
            return null;
        }
        
        console.log('[AutoExpanderSources] Found last <li>:', lastLi);
        
        // Szukaj przycisku w ostatnim <li>
        const button = lastLi.querySelector('[role="button"]');
        if (!button) {
            console.log('[AutoExpanderSources] No button found in last <li>');
            return null;
        }
        
        console.log('[AutoExpanderSources] Found button in last <li>:', button);
        console.log('[AutoExpanderSources] Button text:', button.textContent?.trim());
        
        return button;
    }

    // Fallback strategia - szuka przycisków z cursor:pointer (nowa metoda)
    findExpandButtonFallback() {
        console.log('[AutoExpanderSources] Using fallback strategy - looking for cursor:pointer buttons');
        
        // Szukaj przycisków z cursor:pointer w #m-x-content
        const buttons = document.querySelectorAll('#m-x-content [role="button"][style*="cursor:pointer"]');
        console.log('[AutoExpanderSources] Found cursor:pointer buttons:', buttons.length);
        
        for (let button of buttons) {
            // Sprawdź czy przycisk ma ikonki/obrazki (często znak expandowania)
            const hasImages = button.querySelectorAll('img').length > 0;
            
            // Sprawdź czy ma tekst z liczbą lub +
            const buttonText = button.textContent?.trim() || '';
            const hasNumberOrPlus = /[\+\d]/.test(buttonText);
            
            console.log('[AutoExpanderSources] Checking button:', {
                text: buttonText,
                hasImages,
                hasNumberOrPlus,
                element: button
            });
            
            // Jeśli ma obrazki lub liczbę/plus, prawdopodobnie to przycisk expandowania
            if (hasImages || hasNumberOrPlus) {
                console.log('[AutoExpanderSources] Found potential expand button via fallback');
                return button;
            }
        }
        
        // Jeśli nic nie znaleziono, spróbuj ostatni przycisk z cursor:pointer
        if (buttons.length > 0) {
            const lastButton = buttons[buttons.length - 1];
            console.log('[AutoExpanderSources] Using last cursor:pointer button as fallback');
            return lastButton;
        }
        
        console.log('[AutoExpanderSources] No suitable button found in fallback strategy');
        return null;
    }

    // Szuka przycisku rozwijania źródeł (stara metoda - backup)
    findSourcesExpandButton() {
        // Szukaj w sekcji MSC (Most Shared Content)
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        if (!mscSection) {
            console.log('[AutoExpanderSources] MSC section not found');
            return null;
        }

        // Szukaj wszystkich przycisków w tej sekcji
        const buttons = mscSection.querySelectorAll('[role="button"]');
        
        for (let button of buttons) {
            const buttonText = button.textContent?.trim() || '';
            // Sprawdź różne warianty tekstu przycisku
            if (buttonText.includes('Pokaż wszystko') || 
                buttonText.includes('Show all') || 
                buttonText.includes('Zobacz więcej') ||
                buttonText.includes('Show more')) {
                console.log('[AutoExpanderSources] Found sources button with text:', buttonText);
                return button;
            }
        }

        console.log('[AutoExpanderSources] Sources expand button not found in MSC section');
        return null;
    }

    // Czeka aż pierwszy moduł da sygnał gotowości
    async waitForReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                if (this.isReady) {
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    }

    // Czeka na zakończenie animacji rozwinięcia źródeł
    async waitForSourcesExpansion() {
        return new Promise((resolve) => {
            // Czekaj podstawowy czas na animację
            setTimeout(() => {
                console.log('[AutoExpanderSources] Sources expansion animation completed');
                resolve();
            }, 800);
        });
    }

    // Pomocnicza funkcja opóźnienia
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Sprawdza czy źródła są już rozwinięte
    areSourcesExpanded() {
        // Sprawdź czy istnieje div z style="height: 100%" w #m-x-content
        const expandedDiv = document.querySelector('#m-x-content div[style*="height: 100%"]');
        return !!expandedDiv;
    }

    // Sprawdza czy sekcja źródeł w ogóle istnieje
    areSourcesPresent() {
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        return !!mscSection;
    }
}

// Eksportuj klasę dla innych modułów
window.AutoExpanderSources = AutoExpanderSources;
