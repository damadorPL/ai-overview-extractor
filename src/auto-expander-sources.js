class AutoExpanderSources {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
        this.expansionCallbacks = [];
        this.isReady = false;
        this.domObserver = null;
        this.domChanges = [];
        this.buttonClicked = false; // Flaga zapobiega wielokrotnemu klikaniu
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
                this.buttonClicked = true; // Ustaw flagę, aby nie próbować ponownie
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

                // Dodatkowo wywołaj setReady na autoWebhook, jeśli jest dostępny
                if (window.autoWebhook && typeof window.autoWebhook.setReady === 'function') {
                    window.autoWebhook.setReady();
                    console.log('[AutoExpanderSources] autoWebhook.setReady() called');
                }
                
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
        // Sprawdź czy już kliknęliśmy - jeśli tak, to KONIEC
        if (this.buttonClicked) {
            console.log('[AutoExpanderSources] Button already clicked, stopping');
            return true;
        }
        
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
            
            // Loguj stan przed kliknięciem
            const beforeCount = this.countAllVisibleSources();
            console.log('[AutoExpanderSources] Sources count before click:', beforeCount);
            
            // Rozpocznij obserwację DOM przed kliknięciem
            this.startDOMLogger();
            
            // Kliknij przycisk TYLKO RAZ
            try {
                button.click();
                this.buttonClicked = true; // USTAW FLAGĘ - NIGDY WIĘCEJ NIE KLIKAJ!
                console.log('[AutoExpanderSources] Button clicked successfully - NEVER CLICKING AGAIN!');
                
                // Czekaj na rozwinięcie i obserwuj zmiany DOM
                await this.delay(2000);
                
                // Zatrzymaj obserwację DOM
                this.stopDOMLogger();
                
                // Loguj stan po kliknięciu
                const afterCount = this.countAllVisibleSources();
                console.log('[AutoExpanderSources] Sources count after click:', afterCount);
                
                // ZAWSZE zwracaj sukces po kliknięciu - nie sprawdzaj czy się rozwinęło
                console.log('[AutoExpanderSources] Click completed - SUCCESS!');
                return true;
                
            } catch (error) {
                console.log('[AutoExpanderSources] Click failed:', error);
                // Zatrzymaj obserwację DOM w razie błędu
                this.stopDOMLogger();
                // Resetuj flagę jeśli kliknięcie nie powiodło się
                this.buttonClicked = false;
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
    
    // Liczy wszystkie widoczne źródła w całym #m-x-content
    countAllVisibleSources() {
        const container = document.querySelector('#m-x-content');
        if (!container) return 0;
        
        const links = container.querySelectorAll('a[href]');
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
        
        // Szukaj przycisku w ostatnim <li> z role="button" i jsaction zaczynającym się od "trigger"
        const buttons = lastLi.querySelectorAll('[role="button"][jsaction^="trigger"]');
        if (buttons.length === 0) {
            console.log('[AutoExpanderSources] No button with role="button" and jsaction starting with "trigger" found in last <li>');
            return null;
        }
        
        const button = buttons[0];
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

    // Rozpoczyna obserwację zmian DOM
    startDOMLogger() {
        console.log('[AutoExpanderSources] Starting DOM observer...');
        this.domChanges = [];
        
        const targetContainer = document.querySelector('#m-x-content') || document.body;
        
        this.domObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                this.logDOMChange(mutation);
            });
        });
        
        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true
        };
        
        this.domObserver.observe(targetContainer, observerConfig);
        console.log('[AutoExpanderSources] DOM observer started');
    }

    // Zatrzymuje obserwację zmian DOM
    stopDOMLogger() {
        if (this.domObserver) {
            this.domObserver.disconnect();
            this.domObserver = null;
            console.log('[AutoExpanderSources] DOM observer stopped');
        }
        
        // Podsumowanie zmian
        console.log(`[AutoExpanderSources] DOM Logger Summary: ${this.domChanges.length} total changes`);
        this.domChanges.forEach((change, index) => {
            console.log(`[AutoExpanderSources] Change ${index + 1}:`, change);
        });
    }

    // Loguje pojedynczą zmianę DOM
    logDOMChange(mutation) {
        const timestamp = Date.now();
        const changeData = {
            timestamp,
            type: mutation.type,
            target: this.getElementPath(mutation.target)
        };

        if (mutation.type === 'childList') {
            changeData.addedNodes = Array.from(mutation.addedNodes).map(node => ({
                type: node.nodeType,
                name: node.nodeName,
                className: node.className || '',
                text: node.textContent?.substring(0, 50) || ''
            }));
            
            changeData.removedNodes = Array.from(mutation.removedNodes).map(node => ({
                type: node.nodeType,
                name: node.nodeName,
                className: node.className || '',
                text: node.textContent?.substring(0, 50) || ''
            }));
        }

        if (mutation.type === 'attributes') {
            changeData.attributeName = mutation.attributeName;
            changeData.oldValue = mutation.oldValue;
            changeData.newValue = mutation.target.getAttribute(mutation.attributeName);
        }

        if (mutation.type === 'characterData') {
            changeData.oldValue = mutation.oldValue;
            changeData.newValue = mutation.target.textContent;
        }

        this.domChanges.push(changeData);
        
        // Real-time logging dla ważnych zmian
        if (mutation.addedNodes.length > 0) {
            console.log('[AutoExpanderSources] DOM: Added nodes:', changeData.addedNodes);
        }
        if (mutation.removedNodes.length > 0) {
            console.log('[AutoExpanderSources] DOM: Removed nodes:', changeData.removedNodes);
        }
    }

    // Generuje ścieżkę do elementu
    getElementPath(element) {
        if (!element || element === document.body) return 'body';
        
        const path = [];
        let current = element;
        
        while (current && current !== document.body && path.length < 10) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id) {
                selector += `#${current.id}`;
            } else if (current.className) {
                const classes = current.className.split(' ').filter(c => c.length > 0);
                if (classes.length > 0) {
                    selector += `.${classes.slice(0, 2).join('.')}`;
                }
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }

    // Sprawdza czy źródła są już rozwinięte
    areSourcesExpanded() {
        console.log('[AutoExpanderSources] Checking if sources are expanded...');
        
        // Strategia 1: Sprawdź czy istnieje div z style="height: 100%" w #m-x-content
        const expandedDiv = document.querySelector('#m-x-content div[style*="height: 100%"]');
        if (expandedDiv) {
            console.log('[AutoExpanderSources] Found height: 100% div - sources expanded');
            return true;
        }
        
        // Strategia 2: Sprawdź czy przycisk "+X" zniknął (został już kliknięty)
        const expandButtons = document.querySelectorAll('#m-x-content [role="button"][style*="cursor:pointer"]');
        const hasExpandButton = Array.from(expandButtons).some(btn => {
            const text = btn.textContent?.trim() || '';
            const isPlusNumber = /\+\d+/.test(text); // Szuka wzorca "+liczba"
            console.log(`[AutoExpanderSources] Checking button text: "${text}", isPlusNumber: ${isPlusNumber}`);
            return isPlusNumber;
        });
        
        if (!hasExpandButton) {
            console.log('[AutoExpanderSources] No +X button found - sources likely expanded');
            return true;
        }
        
        // Strategia 3: Sprawdź liczbę widocznych linków w MSC sekcji
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        if (mscSection) {
            const visibleLinks = this.countVisibleSources(mscSection);
            console.log('[AutoExpanderSources] Found', visibleLinks, 'visible links in MSC section');
            
            // Jeśli jest więcej niż 5 linków, prawdopodobnie rozwinięte
            if (visibleLinks > 5) {
                console.log('[AutoExpanderSources] Many links found - sources likely expanded');
                return true;
            }
        }
        
        console.log('[AutoExpanderSources] Sources not yet expanded');
        return false;
    }

    // Sprawdza czy sekcja źródeł w ogóle istnieje
    areSourcesPresent() {
        const mscSection = document.querySelector('div[data-subtree="msc"]');
        return !!mscSection;
    }
}

// Eksportuj klasę dla innych modułów
window.AutoExpanderSources = AutoExpanderSources;
