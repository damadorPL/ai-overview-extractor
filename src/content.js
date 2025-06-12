class AIOverviewExtractor {
    constructor() {
        this.webhookManager = new WebhookManager();
        this.settingsManager = new SettingsManager();
        this.settings = null;
        this.isInitialized = false;
        this.debounceTimer = null;
        this.containerProcessed = false;
        this.scrollHandler = null;
        
        // Initialize auto-expansion modules
        this.autoExpanderOverviews = new AutoExpanderOverviews(this.settingsManager);
        this.autoExpanderSources = new AutoExpanderSources(this.settingsManager);
        this.autoWebhook = new AutoWebhook(this.settingsManager, this.webhookManager);
        
        // Initialize extraction modules
        this.extractionOrchestrator = new ExtractionOrchestrator(this.webhookManager, this.settingsManager);
        
        this.init();
    }

    async init() {
        if (this.isInitialized) {
            console.log('[AI Overview Extractor] Already initialized, skipping...');
            return;
        }
        
        console.log('[AI Overview Extractor] Initializing...');
        this.isInitialized = true;
        
        // Load settings
        this.settings = await this.settingsManager.getSettings();
        console.log('[AI Overview Extractor] Settings loaded:', this.settings);
        
        // Setup module callbacks
        this.setupModuleCallbacks();
        
        // Remove orchestrateModules call to avoid skipping due to missing container
        // await this.orchestrateModules();
        
        // Setup MutationObserver to detect #m-x-content and start automation immediately
        this.observeContainerAndStartAutomation();
        
        // Setup scroll observation for late-loading AI Overviews
        this.setupScrollObserver();
    }

    observeContainerAndStartAutomation() {
        const checkAndStart = () => {
            const container = document.querySelector('#m-x-content');
            if (container) {
                console.log('[AI Overview Extractor] Found #m-x-content, starting automation');
                this.handleContainerFound(container);
                return true;
            }
            return false;
        };

        if (!checkAndStart()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (checkAndStart()) {
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('[AI Overview Extractor] MutationObserver set to watch for #m-x-content');
        }
    }

    async handleContainerFound(container) {
        if (this.containerProcessed) {
            console.log('[AI Overview Extractor] Container already processed, skipping automation');
            return;
        }

        if (this.settings.autoExpandOverviews) {
            console.log('[AI Overview Extractor] Auto-expand overviews enabled, starting expansion');
            const expanded = await this.autoExpanderOverviews.expandAIOverview();
            if (expanded) {
                console.log('[AI Overview Extractor] AI overview expanded, starting sources expansion');
                if (this.settings.autoExpandSources) {
                    const sourcesExpanded = await this.autoExpanderSources.expandSources();
                    if (sourcesExpanded) {
                        console.log('[AI Overview Extractor] Sources expansion completed');
                        if (this.settings.autoSendWebhook) {
                            const webhookSent = await this.autoWebhook.autoSendWebhook();
                            if (webhookSent) {
                                console.log('[AI Overview Extractor] Auto webhook completed');
                            }
                        }
                    }
                }
            } else {
                // Jeśli AI overview jest już rozwinięte, kontynuuj rozwijanie źródeł i wysyłanie webhooka
                console.log('[AI Overview Extractor] AI overview already expanded, continuing sources expansion');
                if (this.settings.autoExpandSources) {
                    const sourcesExpanded = await this.autoExpanderSources.expandSources();
                    if (sourcesExpanded) {
                        console.log('[AI Overview Extractor] Sources expansion completed');
                        if (this.settings.autoSendWebhook) {
                            const webhookSent = await this.autoWebhook.autoSendWebhook();
                            if (webhookSent) {
                                console.log('[AI Overview Extractor] Auto webhook completed');
                            }
                        }
                    }
                }
            }
        } else {
            console.log('[AI Overview Extractor] Auto-expand overviews disabled, adding button');
            this.addButton(container);
        }

        this.containerProcessed = true;
        this.removeScrollObserver();
    }

    // Setup callbacks between modules
    setupModuleCallbacks() {
        // When AI Overview expansion completes, signal to sources expander and start sources expansion
        this.autoExpanderOverviews.onExpansionComplete(async () => {
            console.log('[AI Overview Extractor] AI Overview expanded, starting sources expansion');
            this.autoExpanderSources.setReady();
            if (this.settings.autoExpandSources) {
                const sourcesExpanded = await this.autoExpanderSources.expandSources();
                if (sourcesExpanded) {
                    console.log('[AI Overview Extractor] Sources expansion completed');
                    this.autoExpanderSources.expansionCallbacks.forEach(cb => {
                        try { cb(); } catch (e) { console.error(e); }
                    });
                }
            } else {
                console.log('[AI Overview Extractor] Auto expand sources disabled');
            }
        });

        // When sources expansion completes, signal to webhook and send webhook
        this.autoExpanderSources.onExpansionComplete(() => {
            console.log('[AI Overview Extractor] Sources expanded, signaling webhook');
            this.autoWebhook.setReady();
            if (this.settings.autoSendWebhook) {
                this.autoWebhook.autoSendWebhook().then(sent => {
                    if (sent) {
                        console.log('[AI Overview Extractor] Auto webhook completed');
                    } else {
                        console.log('[AI Overview Extractor] Auto webhook failed or skipped');
                    }
                });
            } else {
                console.log('[AI Overview Extractor] Auto send webhook disabled');
            }
        });
    }

    // Orchestrate the execution of all modules in sequence
    async orchestrateModules() {
        try {
            console.log('[AI Overview Extractor] Starting module orchestration');

            // Sprawdź czy mamy #m-x-content
            const container = document.querySelector('#m-x-content');
            if (!container) {
                console.log('[AI Overview Extractor] No AI Overview container found, skipping orchestration');
                return;
            }

            // Step 1: Expand AI Overview
            const overviewExpanded = await this.autoExpanderOverviews.expandAIOverview();
            if (overviewExpanded) {
                console.log('[AI Overview Extractor] AI Overview expansion completed');
                
                // Step 2: Expand Sources (will wait for signal from overview expander)
                const sourcesExpanded = await this.autoExpanderSources.expandSources();
                if (sourcesExpanded) {
                    console.log('[AI Overview Extractor] Sources expansion completed');
                }
                
                // Step 3: Auto send webhook (will wait for signal from sources expander)
                const webhookSent = await this.autoWebhook.autoSendWebhook();
                if (webhookSent) {
                    console.log('[AI Overview Extractor] Auto webhook completed');
                }
            }

            console.log('[AI Overview Extractor] Module orchestration completed');
        } catch (error) {
            console.error('[AI Overview Extractor] Error in module orchestration:', error);
        }
    }

    async autoExpandAIOverview() {
        // This method is kept for backward compatibility
        // The actual expansion is now handled by AutoExpanderOverviews module
        return await this.autoExpanderOverviews.expandAIOverview();
    }

    setupScrollObserver() {
        // Only setup scroll observer if container not already processed
        if (this.containerProcessed) {
            return;
        }

        this.scrollHandler = () => {
            if (!this.containerProcessed) {
                this.debouncedCheckAndAddButton();
            }
        };

        let scrollTimeout;
        const debouncedScrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(this.scrollHandler, 300);
        };

        window.addEventListener('scroll', debouncedScrollHandler);
        console.log('[AI Overview Extractor] Scroll Observer started');
    }

    removeScrollObserver() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
            console.log('[AI Overview Extractor] Scroll Observer removed');
        }
    }

    debouncedCheckAndAddButton() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            this.checkAndAddButton();
        }, 300); // 300ms debounce
    }

    async checkAndAddButton() {
        // Stop checking if container already processed
        if (this.containerProcessed) {
            console.log('[AI Overview Extractor] Container already processed, skipping check');
            return;
        }

        console.log('[AI Overview Extractor] Checking for AI Overview container...');
        
        // Look for #m-x-content
        const container = document.querySelector('#m-x-content');
        
        if (!container) {
            console.log('[AI Overview Extractor] No #m-x-content found');
            return;
        }

        console.log('[AI Overview Extractor] Found #m-x-content:', container);

        // Check if button already exists
        const existingButton = container.parentNode?.querySelector('.ai-extractor-button');
        if (existingButton) {
            console.log('[AI Overview Extractor] Button already exists, skipping');
            return;
        }
        
        // Auto-expand AI overview if enabled and needed
        if (this.settings && this.settings.autoExpandOverviews) {
            console.log('[AI Overview Extractor] Auto-expand overviews enabled, checking for expansion');
            const expanded = await this.autoExpandAIOverview();
            if (expanded) {
                console.log('[AI Overview Extractor] AI overview expanded, will recheck in 1000ms');
                
                // Auto-expand sources if enabled
                if (this.settings.autoExpandSources) {
                    console.log('[AI Overview Extractor] Starting sources expansion after AI overview');
                    const sourcesExpanded = await this.autoExpanderSources.expandSources();
                    if (sourcesExpanded) {
                        console.log('[AI Overview Extractor] Sources expansion completed');
                        
                        // Auto-send webhook if enabled
                        if (this.settings.autoSendWebhook) {
                            console.log('[AI Overview Extractor] Starting auto webhook after sources expansion');
                            const webhookSent = await this.autoWebhook.autoSendWebhook();
                            if (webhookSent) {
                                console.log('[AI Overview Extractor] Auto webhook completed');
                            }
                        }
                    }
                }
                
                // Wait for expansion animation and check again
                setTimeout(() => this.checkAndAddButton(), 1000);
                return;
            }
            console.log('[AI Overview Extractor] No expansion needed, continuing to add button');
        } else {
            console.log('[AI Overview Extractor] Auto-expand overviews disabled');
        }
        
        console.log('[AI Overview Extractor] Found #m-x-content, adding button');
        this.addButton(container);
    }


    addButton(container) {
        const button = document.createElement('button');
        button.className = 'ai-extractor-button';
        button.innerHTML = '📋 Extract to Markdown';
        
        button.addEventListener('click', () => {
            console.log('[AI Overview Extractor] Extraction button clicked');
            this.extractionOrchestrator.handleExtraction(container);
        });

        // Add button above container
        container.parentNode.insertBefore(button, container);
        console.log('[AI Overview Extractor] Button added');
        
        // Mark container as processed and stop further checks
        this.containerProcessed = true;
        this.removeScrollObserver();
        console.log('[AI Overview Extractor] Container processed, stopping all checks');
    }

}

// Message listener for popup communication
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('[AI Overview Extractor] Received message:', message);
        
        if (message.type === 'SETTING_CHANGED') {
            console.log(`[AI Overview Extractor] Setting changed: ${message.key} = ${message.value}`);
            
            // Reload settings in the current instance
            if (window.aiExtractor && window.aiExtractor.settingsManager) {
                window.aiExtractor.settingsManager.getSettings().then(settings => {
                    window.aiExtractor.settings = settings;
                    console.log('[AI Overview Extractor] Settings refreshed:', settings);
                });
            }
            
            sendResponse({ success: true });
        } else if (message.type === 'SETTINGS_RESET') {
            console.log('[AI Overview Extractor] Settings reset');
            
            // Reload settings in the current instance
            if (window.aiExtractor && window.aiExtractor.settingsManager) {
                window.aiExtractor.settingsManager.getSettings().then(settings => {
                    window.aiExtractor.settings = settings;
                    console.log('[AI Overview Extractor] Settings refreshed after reset:', settings);
                });
            }
            
            sendResponse({ success: true });
        }
        
        return true; // Keep message channel open for async response
    });
}

// Uruchom wtyczkę
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiExtractor = new AIOverviewExtractor();
    });
} else {
    window.aiExtractor = new AIOverviewExtractor();
}
