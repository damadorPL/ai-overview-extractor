class ContainerDetectionManager {
    constructor(onContainerFound) {
        this.onContainerFound = onContainerFound;
        this.isProcessing = false;
        this.detectionLock = false;
        this.containerProcessed = false;
        this.mutationObserver = null;
        this.scrollHandler = null;
        this.checkTimeout = null;
        
        console.log('[ContainerDetectionManager] Initialized');
    }

    // Rozpoczyna ujednoliconą detekcję kontenera
    startDetection() {
        if (this.containerProcessed) {
            console.log('[ContainerDetectionManager] Container already processed, skipping detection');
            return;
        }

        console.log('[ContainerDetectionManager] Starting unified container detection');
        
        // Immediate check
        this.checkForContainer();
        
        // Setup MutationObserver for DOM changes
        this.setupMutationObserver();
        
        // Setup scroll observer as fallback
        this.setupScrollObserver();
        
        // Periodic check as additional fallback
        this.setupPeriodicCheck();
    }

    // Sprawdza obecność kontenera i wywołuje callback jeśli znaleziony
    checkForContainer() {
        if (this.detectionLock || this.containerProcessed) {
            return false;
        }
        
        const container = document.querySelector('#m-x-content');
        if (container) {
            console.log('[ContainerDetectionManager] Container #m-x-content found');
            this.handleContainerDetected(container);
            return true;
        }
        
        return false;
    }

    // Obsługuje wykrycie kontenera
    async handleContainerDetected(container) {
        if (this.detectionLock || this.containerProcessed) {
            console.log('[ContainerDetectionManager] Container detection already in progress or completed');
            return;
        }

        console.log('[ContainerDetectionManager] Handling container detection');
        
        // Lock detection to prevent race conditions
        this.detectionLock = true;
        this.isProcessing = true;
        
        try {
            // Stop all detection mechanisms
            this.stopAllDetection();
            
            // Call the callback
            await this.onContainerFound(container);
            
            // Mark as processed
            this.containerProcessed = true;
            
            console.log('[ContainerDetectionManager] Container processing completed');
        } catch (error) {
            console.error('[ContainerDetectionManager] Error processing container:', error);
            
            // Reset locks on error to allow retry
            this.detectionLock = false;
            this.isProcessing = false;
            
            // Restart detection after error with delay
            setTimeout(() => {
                if (!this.containerProcessed) {
                    console.log('[ContainerDetectionManager] Restarting detection after error');
                    this.startDetection();
                }
            }, 2000);
        }
    }

    // Konfiguruje MutationObserver
    setupMutationObserver() {
        if (this.mutationObserver) {
            return; // Already setup
        }

        this.mutationObserver = new MutationObserver((mutations) => {
            // Debounce rapid mutations
            if (this.checkTimeout) {
                clearTimeout(this.checkTimeout);
            }
            
            this.checkTimeout = setTimeout(() => {
                this.checkForContainer();
            }, 100);
        });

        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: false // We only care about DOM structure changes
        };

        this.mutationObserver.observe(document.body, observerConfig);
        console.log('[ContainerDetectionManager] MutationObserver started');
    }

    // Konfiguruje scroll observer jako fallback
    setupScrollObserver() {
        if (this.scrollHandler) {
            return; // Already setup
        }

        let scrollTimeout;
        this.scrollHandler = () => {
            if (this.containerProcessed) {
                return;
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.checkForContainer();
            }, 300);
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        console.log('[ContainerDetectionManager] Scroll observer started');
    }

    // Konfiguruje okresowe sprawdzanie jako dodatkowy fallback
    setupPeriodicCheck() {
        const periodicCheck = () => {
            if (this.containerProcessed) {
                return;
            }
            
            this.checkForContainer();
            
            // Continue checking every 2 seconds if container not found
            setTimeout(periodicCheck, 2000);
        };
        
        // Start periodic check after initial delay
        setTimeout(periodicCheck, 1000);
        console.log('[ContainerDetectionManager] Periodic check started');
    }

    // Zatrzymuje wszystkie mechanizmy detekcji
    stopAllDetection() {
        console.log('[ContainerDetectionManager] Stopping all detection mechanisms');
        
        // Stop MutationObserver
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
            console.log('[ContainerDetectionManager] MutationObserver stopped');
        }
        
        // Stop scroll observer
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
            console.log('[ContainerDetectionManager] Scroll observer stopped');
        }
        
        // Clear any pending timeouts
        if (this.checkTimeout) {
            clearTimeout(this.checkTimeout);
            this.checkTimeout = null;
        }
    }

    // Resetuje stan managera (użyteczne przy zmianie ustawień)
    reset() {
        console.log('[ContainerDetectionManager] Resetting detection state');
        
        this.stopAllDetection();
        this.isProcessing = false;
        this.detectionLock = false;
        this.containerProcessed = false;
        
        console.log('[ContainerDetectionManager] Reset completed');
    }

    // Sprawdza aktualny stan detection managera
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            detectionLock: this.detectionLock,
            containerProcessed: this.containerProcessed,
            hasMutationObserver: !!this.mutationObserver,
            hasScrollHandler: !!this.scrollHandler,
            hasContainer: !!document.querySelector('#m-x-content')
        };
    }

    // Wymusza ponowne sprawdzenie kontenera (użyteczne dla debugging)
    forceCheck() {
        console.log('[ContainerDetectionManager] Forcing container check');
        this.checkForContainer();
    }

    // Wymusza restart detekcji
    forceRestart() {
        console.log('[ContainerDetectionManager] Forcing detection restart');
        this.reset();
        this.startDetection();
    }

    // Sprawdza czy container jest już obecny na stronie
    isContainerPresent() {
        return !!document.querySelector('#m-x-content');
    }

    // Sprawdza czy detekcja jest aktywna
    isDetectionActive() {
        return !this.containerProcessed && (!!this.mutationObserver || !!this.scrollHandler);
    }
}

// Eksportuj klasę dla innych modułów
window.ContainerDetectionManager = ContainerDetectionManager;
