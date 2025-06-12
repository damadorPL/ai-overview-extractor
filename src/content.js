class AIOverviewExtractor {
    constructor() {
        this.webhookManager = new WebhookManager();
        this.settingsManager = new SettingsManager();
        this.settings = null;
        this.isInitialized = false;
        
        // Initialize state management
        this.stateMachine = new AutomationStateMachine();
        
        // Initialize circuit breakers for each module
        this.circuitBreakers = {
            overview: new AutomationCircuitBreaker('AutoExpanderOverviews', { maxFailures: 2, resetTimeout: 30000 }),
            sources: new AutomationCircuitBreaker('AutoExpanderSources', { maxFailures: 3, resetTimeout: 45000 }),
            webhook: new AutomationCircuitBreaker('AutoWebhook', { maxFailures: 2, resetTimeout: 60000 })
        };
        
        // Initialize auto-expansion modules
        this.autoExpanderOverviews = new AutoExpanderOverviews(this.settingsManager);
        this.autoExpanderSources = new AutoExpanderSources(this.settingsManager);
        this.autoWebhook = new AutoWebhook(this.settingsManager, this.webhookManager);
        
        // Initialize extraction modules
        this.extractionOrchestrator = new ExtractionOrchestrator(this.webhookManager, this.settingsManager);
        
        // Initialize container detection manager
        this.containerDetectionManager = new ContainerDetectionManager(
            (container) => this.handleContainerFound(container)
        );
        
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
        
        // Setup state machine callbacks
        this.setupStateMachineCallbacks();
        
        // Start unified container detection
        this.containerDetectionManager.startDetection();
    }

    // Setup callbacks for state machine transitions
    setupStateMachineCallbacks() {
        this.stateMachine.onStateChange((newState, previousState, action, data) => {
            console.log(`[AI Overview Extractor] State transition: ${previousState} -> ${newState} (${action})`);
            
            // Handle state-specific logic
            this.handleStateChange(newState, previousState, action, data);
        });
    }

    // Handle state machine transitions
    async handleStateChange(newState, previousState, action, data) {
        switch (newState) {
            case 'EXPANDING_OVERVIEW':
                await this.executeOverviewExpansion();
                break;
            case 'EXPANDING_SOURCES':
                await this.executeSourcesExpansion();
                break;
            case 'SENDING_WEBHOOK':
                await this.executeWebhookSend();
                break;
            case 'FAILED':
                await this.handleAutomationFailure(data);
                break;
            case 'MANUAL_MODE':
                this.addManualButton(data?.container);
                break;
        }
    }

    async handleContainerFound(container) {
        console.log('[AI Overview Extractor] Container found, determining action based on settings');
        
        // Store container for later use
        this.stateMachine.updateStateData({ container });
        
        // Check automation settings and start appropriate flow
        if (this.settings.autoExpandOverviews || this.settings.autoExpandSources || this.settings.autoSendWebhook) {
            console.log('[AI Overview Extractor] Auto-automation enabled, starting state machine');
            this.stateMachine.transition('START_AUTOMATION', { container });
        } else {
            console.log('[AI Overview Extractor] Auto-automation disabled, switching to manual mode');
            this.stateMachine.transition('MANUAL_MODE', { container });
        }
    }

    // Execute overview expansion with circuit breaker protection
    async executeOverviewExpansion() {
        console.log('[AI Overview Extractor] Executing overview expansion with circuit breaker');
        
        try {
            const result = await this.circuitBreakers.overview.executeWithRetry(
                () => this.autoExpanderOverviews.expandAIOverview(),
                'expandAIOverview',
                1 // Only 1 retry for overview expansion
            );
            
            if (result) {
                console.log('[AI Overview Extractor] Overview expansion succeeded');
                this.stateMachine.transition('OVERVIEW_COMPLETE');
            } else {
                console.log('[AI Overview Extractor] Overview expansion not needed (already expanded)');
                this.stateMachine.transition('OVERVIEW_SKIPPED');
            }
        } catch (error) {
            console.error('[AI Overview Extractor] Overview expansion failed:', error);
            this.stateMachine.transition('OVERVIEW_FAILED', { error: error.message });
        }
    }

    // Execute sources expansion with circuit breaker protection
    async executeSourcesExpansion() {
        console.log('[AI Overview Extractor] Executing sources expansion with circuit breaker');
        
        if (!this.settings.autoExpandSources) {
            console.log('[AI Overview Extractor] Sources expansion disabled, skipping');
            this.stateMachine.transition('SOURCES_SKIPPED');
            return;
        }
        
        try {
            // Signal sources expander that it's ready to work
            this.autoExpanderSources.setReady();
            
            const result = await this.circuitBreakers.sources.executeWithRetry(
                () => this.autoExpanderSources.expandSources(),
                'expandSources',
                2 // 2 retries for sources expansion
            );
            
            if (result) {
                console.log('[AI Overview Extractor] Sources expansion succeeded');
                this.stateMachine.transition('SOURCES_COMPLETE');
            } else {
                console.log('[AI Overview Extractor] Sources expansion not needed');
                this.stateMachine.transition('SOURCES_SKIPPED');
            }
        } catch (error) {
            console.error('[AI Overview Extractor] Sources expansion failed:', error);
            this.stateMachine.transition('SOURCES_FAILED', { error: error.message });
        }
    }

    // Execute webhook send with circuit breaker protection
    async executeWebhookSend() {
        console.log('[AI Overview Extractor] Executing webhook send with circuit breaker');
        
        if (!this.settings.autoSendWebhook) {
            console.log('[AI Overview Extractor] Auto webhook disabled, skipping');
            this.stateMachine.transition('WEBHOOK_SKIPPED');
            return;
        }
        
        try {
            // Signal webhook module that it's ready to work
            this.autoWebhook.setReady();
            
            const result = await this.circuitBreakers.webhook.executeWithRetry(
                () => this.autoWebhook.autoSendWebhook(),
                'autoSendWebhook',
                1 // Only 1 retry for webhook
            );
            
            if (result) {
                console.log('[AI Overview Extractor] Webhook send succeeded');
                this.stateMachine.transition('WEBHOOK_COMPLETE');
            } else {
                console.log('[AI Overview Extractor] Webhook send not needed');
                this.stateMachine.transition('WEBHOOK_SKIPPED');
            }
        } catch (error) {
            console.error('[AI Overview Extractor] Webhook send failed:', error);
            this.stateMachine.transition('WEBHOOK_FAILED', { error: error.message });
        }
    }

    // Handle automation failure
    async handleAutomationFailure(data) {
        console.log('[AI Overview Extractor] Automation failed, falling back to manual mode');
        
        const container = data?.container || this.stateMachine.getStateData().container;
        if (container) {
            this.addManualButton(container);
        }
        
        // Log circuit breaker states for debugging
        console.log('[AI Overview Extractor] Circuit breaker states:', {
            overview: this.circuitBreakers.overview.getMetrics(),
            sources: this.circuitBreakers.sources.getMetrics(),
            webhook: this.circuitBreakers.webhook.getMetrics()
        });
    }

    // Add manual extraction button
    addManualButton(container) {
        console.log('[AI Overview Extractor] Adding manual extraction button');
        
        // Check if button already exists
        const existingButton = container.parentNode?.querySelector('.ai-extractor-button');
        if (existingButton) {
            console.log('[AI Overview Extractor] Button already exists');
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'ai-extractor-button';
        button.innerHTML = '📋 Extract to Markdown';
        
        button.addEventListener('click', () => {
            console.log('[AI Overview Extractor] Manual extraction button clicked');
            this.extractionOrchestrator.handleExtraction(container);
        });

        // Add button above container
        container.parentNode.insertBefore(button, container);
        console.log('[AI Overview Extractor] Manual button added successfully');
    }

    // Get current automation status for debugging
    getAutomationStatus() {
        return {
            stateMachine: {
                currentState: this.stateMachine.getCurrentState(),
                isActive: this.stateMachine.isAutomationActive(),
                isCompleted: this.stateMachine.isCompleted(),
                isFailed: this.stateMachine.isFailed(),
                stateData: this.stateMachine.getStateData()
            },
            circuitBreakers: {
                overview: this.circuitBreakers.overview.getMetrics(),
                sources: this.circuitBreakers.sources.getMetrics(),
                webhook: this.circuitBreakers.webhook.getMetrics()
            },
            containerDetection: this.containerDetectionManager.getStatus(),
            settings: this.settings
        };
    }

    // Reset automation state (useful for debugging/testing)
    resetAutomation() {
        console.log('[AI Overview Extractor] Resetting automation state');
        
        this.stateMachine.reset();
        this.circuitBreakers.overview.reset();
        this.circuitBreakers.sources.reset();
        this.circuitBreakers.webhook.reset();
        this.containerDetectionManager.reset();
        
        console.log('[AI Overview Extractor] Automation state reset completed');
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
