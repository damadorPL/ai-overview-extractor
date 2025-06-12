class AutoExpanderOverviews {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
        this.expansionCallbacks = [];
        console.log('[AutoExpanderOverviews] Initialized');
    }

    // Rejestruje callback wywoływany po rozwinięciu AI Overview
    onExpansionComplete(callback) {
        this.expansionCallbacks.push(callback);
    }

    // Główna metoda rozwijania AI Overview
    async expandAIOverview() {
        try {
            const settings = await this.settingsManager.getSettings();
            if (!settings.autoExpandOverviews) {
                console.log('[AutoExpanderOverviews] Auto-expand AI overviews is disabled');
                return false;
            }

            // Szukaj zwiniętego AI Overview
            const expandButton = document.querySelector('[aria-expanded="false"][aria-controls="m-x-content"]');
            
            if (expandButton) {
                console.log('[AutoExpanderOverviews] Found collapsed AI overview, expanding...');
                
                // Kliknij przycisk rozwijania
                expandButton.click();
                
                // Czekaj na animację rozwinięcia
                await this.waitForExpansion();
                
                console.log('[AutoExpanderOverviews] AI overview expanded successfully');
                
                // Wywołaj wszystkie callbacki
                this.expansionCallbacks.forEach(callback => {
                    try {
                        callback();
                    } catch (error) {
                        console.error('[AutoExpanderOverviews] Error in expansion callback:', error);
                    }
                });
                
                return true;
            } else {
                console.log('[AutoExpanderOverviews] No collapsed AI overview found');
                return false;
            }
        } catch (error) {
            console.error('[AutoExpanderOverviews] Error in expandAIOverview:', error);
            return false;
        }
    }

    // Czeka na zakończenie animacji rozwinięcia
    async waitForExpansion() {
        return new Promise((resolve) => {
            // Czekaj podstawowy czas na animację
            setTimeout(() => {
                // Sprawdź czy element rzeczywiście się rozwinął
                const checkExpanded = () => {
                    const expandedButton = document.querySelector('[aria-expanded="true"][aria-controls="m-x-content"]');
                    if (expandedButton) {
                        console.log('[AutoExpanderOverviews] Expansion confirmed');
                        resolve();
                    } else {
                        // Jeśli nie rozwinęło się, czekaj jeszcze trochę
                        setTimeout(checkExpanded, 200);
                    }
                };
                checkExpanded();
            }, 800);
        });
    }

    // Sprawdza czy AI Overview jest już rozwinięte
    isExpanded() {
        const expandedButton = document.querySelector('[aria-expanded="true"][aria-controls="m-x-content"]');
        return !!expandedButton;
    }

    // Sprawdza czy AI Overview w ogóle istnieje na stronie
    isPresent() {
        const container = document.querySelector('#m-x-content');
        return !!container;
    }
}

// Eksportuj klasę dla innych modułów
window.AutoExpanderOverviews = AutoExpanderOverviews;
