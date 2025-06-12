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
            
            // Znajdź przycisk - tylko [role="button"]
            const button = mscSection.querySelector('[role="button"]');
            if (!button) {
                console.log('[AutoExpanderSources] No button found in MSC section, retrying...');
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
