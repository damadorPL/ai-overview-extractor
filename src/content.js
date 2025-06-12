class AIOverviewExtractor {
    constructor() {
        this.webhookManager = new WebhookManager();
        this.settingsManager = new SettingsManager();
        this.settings = null;
        this.isInitialized = false;
        this.debounceTimer = null;
        
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
        
        // Start the orchestrated automation
        await this.orchestrateModules();
        
        // Check immediately if container exists
        this.debouncedCheckAndAddButton();
        
        // Observe DOM changes
        this.observeDOM();
    }

    // Setup callbacks between modules
    setupModuleCallbacks() {
        // When AI Overview expansion completes, signal to sources expander
        this.autoExpanderOverviews.onExpansionComplete(() => {
            console.log('[AI Overview Extractor] AI Overview expanded, signaling sources expander');
            this.autoExpanderSources.setReady();
        });

        // When sources expansion completes, signal to webhook
        this.autoExpanderSources.onExpansionComplete(() => {
            console.log('[AI Overview Extractor] Sources expanded, signaling webhook');
            this.autoWebhook.setReady();
        });
    }

    // Orchestrate the execution of all modules in sequence
    async orchestrateModules() {
        try {
            console.log('[AI Overview Extractor] Starting module orchestration');

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

    observeDOM() {
        const observer = new MutationObserver(() => {
            this.debouncedCheckAndAddButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[AI Overview Extractor] DOM Observer started');
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
        // Look for #m-x-content
        const container = document.querySelector('#m-x-content');
        
        if (!container) {
            return;
        }

        // Check if button already exists
        const existingButton = container.parentNode?.querySelector('.ai-extractor-button');
        if (existingButton) {
            return;
        }
        
        // Auto-expand AI overview if enabled and needed
        if (this.settings && this.settings.autoExpandOverviews) {
            const expanded = await this.autoExpandAIOverview();
            if (expanded) {
                console.log('[AI Overview Extractor] AI overview expanded, will recheck in 1000ms');
                // Wait for expansion animation and check again
                setTimeout(() => this.checkAndAddButton(), 1000);
                return;
            }
            console.log('[AI Overview Extractor] No expansion needed, continuing to add button');
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
