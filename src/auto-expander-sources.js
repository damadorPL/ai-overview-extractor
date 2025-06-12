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
        const maxAttempts = 30; // 15 sekund (30 * 500ms)
        let attempt = 0;
        
        while (attempt < maxAttempts) {
            attempt++;
            console.log(`[AutoExpanderSources] Attempt ${attempt}/${maxAttempts}`);
            
            // Znajdź sekcję MSC
            const mscSection = document.querySelector('div[data-subtree="msc"]');
            if (!mscSection) {
                console.log('[AutoExpanderSources] MSC section not found, retrying...');
                await this.delay(500);
                continue;
            }
            
            // Zapisz obecną liczbę źródeł
            const sourcesCountBefore = this.countVisibleSources(mscSection);
            
            // Próbuj różne selektory w kolejności preferencji
            const selectors = [
                '[role="button"]',
                'button',
                '[tabindex="0"]',
                '[jsaction*="trigger"]',
                'div[class*="button"], span[class*="button"]'
            ];
            
            let buttonFound = false;
            
            for (const selector of selectors) {
                const buttons = mscSection.querySelectorAll(selector);
                console.log(`[AutoExpanderSources] Found ${buttons.length} elements with selector: ${selector}`);
                
                for (const button of buttons) {
                    // Sprawdź czy to prawdopodobnie przycisk expand
                    if (this.isProbablyExpandButton(button)) {
                        console.log('[AutoExpanderSources] Found potential expand button:', button);
                        
                        // Próbuj różne metody kliknięcia
                        const success = await this.tryClickButton(button);
                        if (success) {
                            // Czekaj na zmianę
                            await this.delay(1000);
                            
                            // Sprawdź czy liczba źródeł wzrosła
                            const sourcesCountAfter = this.countVisibleSources(mscSection);
                            if (sourcesCountAfter > sourcesCountBefore) {
                                console.log(`[AutoExpanderSources] Success! Sources increased from ${sourcesCountBefore} to ${sourcesCountAfter}`);
                                return true;
                            }
                            
                            // Sprawdź czy przycisk zniknął
                            if (!this.isElementVisible(button)) {
                                console.log('[AutoExpanderSources] Success! Button disappeared');
                                return true;
                            }
                        }
                        buttonFound = true;
                    }
                }
                
                if (buttonFound) break;
            }
            
            // Jeśli nie znaleziono przycisku, może już jest rozwinięte?
            if (!buttonFound && sourcesCountBefore > 3) {
                console.log('[AutoExpanderSources] No expand button found, sources might already be expanded');
                return true;
            }
            
            await this.delay(500);
        }
        
        console.log('[AutoExpanderSources] Max attempts reached, giving up');
        return false;
    }
    
    // Sprawdza czy element prawdopodobnie jest przyciskiem expand
    isProbablyExpandButton(element) {
        const text = element.textContent?.trim().toLowerCase() || '';
        const hasExpandText = text.includes('pokaż') || text.includes('show') || text.includes('więcej') || text.includes('all') || text.includes('more');
        
        // Sprawdź czy ma jsaction related do triggera
        const jsaction = element.getAttribute('jsaction') || '';
        const hasJsAction = jsaction.includes('trigger');
        
        // Sprawdź czy wygląda jak przycisk
        const hasButtonRole = element.getAttribute('role') === 'button' || element.tagName === 'BUTTON';
        const hasTabIndex = element.hasAttribute('tabindex');
        
        return hasExpandText || (hasJsAction && (hasButtonRole || hasTabIndex));
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

    // Szuka przycisku rozwijania źródeł
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
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        if (!mscSection) return false;

        // Sprawdź czy przycisk "Pokaż wszystko" już nie istnieje (co oznacza że źródła są rozwinięte)
        const expandButton = this.findSourcesExpandButton();
        return !expandButton;
    }

    // Sprawdza czy sekcja źródeł w ogóle istnieje
    areSourcesPresent() {
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        return !!mscSection;
    }
}

// Eksportuj klasę dla innych modułów
window.AutoExpanderSources = AutoExpanderSources;
