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

            // Szukaj przycisku "Pokaż wszystko" w sekcji źródeł
            const sourcesExpandButton = this.findSourcesExpandButton();
            
            if (sourcesExpandButton) {
                console.log('[AutoExpanderSources] Found sources expand button, expanding...');
                
                // Kliknij przycisk rozwijania źródeł
                sourcesExpandButton.click();
                
                // Czekaj na animację rozwinięcia
                await this.waitForSourcesExpansion();
                
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
                console.log('[AutoExpanderSources] No sources expand button found');
                return false;
            }
        } catch (error) {
            console.error('[AutoExpanderSources] Error in expandSources:', error);
            return false;
        }
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
