class PopupManager {
    constructor() {
        this.settingsManager = new SettingsManager();
        this.init();
    }

    async init() {
        console.log('[Popup] Initializing popup...');
        
        // Load current settings
        await this.loadSettings();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('[Popup] Popup initialized');
    }

    async loadSettings() {
        try {
            this.showStatus('⚙️', 'Loading settings...', 'loading');
            
            const settings = await this.settingsManager.getSettings();
            console.log('[Popup] Settings loaded:', settings);
            
            // Update UI with current settings
            this.updateUI(settings);
            
            this.showStatus('✅', 'Settings loaded successfully', 'success');
            
            // Hide status after 2 seconds
            setTimeout(() => {
                this.hideStatus();
            }, 2000);
            
        } catch (error) {
            console.error('[Popup] Error loading settings:', error);
            this.showStatus('❌', 'Error loading settings', 'error');
        }
    }

    updateUI(settings) {
        // Update toggle switches
        const autoExpandOverviews = document.getElementById('autoExpandOverviews');
        const autoExpandSources = document.getElementById('autoExpandSources');
        const autoSendWebhook = document.getElementById('autoSendWebhook');

        if (autoExpandOverviews) {
            autoExpandOverviews.checked = settings.autoExpandOverviews;
        }
        
        if (autoExpandSources) {
            autoExpandSources.checked = settings.autoExpandSources;
        }
        
        if (autoSendWebhook) {
            autoSendWebhook.checked = settings.autoSendWebhook;
        }

        console.log('[Popup] UI updated with settings');
    }

    setupEventListeners() {
        // Auto expand overviews toggle
        const autoExpandOverviews = document.getElementById('autoExpandOverviews');
        if (autoExpandOverviews) {
            autoExpandOverviews.addEventListener('change', async (e) => {
                await this.handleSettingChange('autoExpandOverviews', e.target.checked);
            });
        }

        // Auto expand sources toggle
        const autoExpandSources = document.getElementById('autoExpandSources');
        if (autoExpandSources) {
            autoExpandSources.addEventListener('change', async (e) => {
                await this.handleSettingChange('autoExpandSources', e.target.checked);
            });
        }


        // Auto send webhook toggle
        const autoSendWebhook = document.getElementById('autoSendWebhook');
        if (autoSendWebhook) {
            autoSendWebhook.addEventListener('change', async (e) => {
                await this.handleSettingChange('autoSendWebhook', e.target.checked);
            });
        }


        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', async () => {
                await this.handleReset();
            });
        }

        console.log('[Popup] Event listeners setup complete');
    }

    async handleSettingChange(key, value) {
        try {
            console.log(`[Popup] Changing setting ${key} to ${value}`);
            
            this.showStatus('⚙️', 'Saving setting...', 'loading');
            
            const success = await this.settingsManager.saveSetting(key, value);
            
            if (success) {
                this.showStatus('✅', 'Setting saved', 'success');
                console.log(`[Popup] Setting ${key} saved successfully`);
                
                // Notify content scripts about the change
                await this.notifyContentScripts(key, value);
                
            } else {
                this.showStatus('❌', 'Error saving setting', 'error');
                console.error(`[Popup] Failed to save setting ${key}`);
                
                // Revert the toggle if save failed
                await this.loadSettings();
            }
            
            // Hide status after 2 seconds
            setTimeout(() => {
                this.hideStatus();
            }, 2000);
            
        } catch (error) {
            console.error('[Popup] Error handling setting change:', error);
            this.showStatus('❌', 'Error saving setting', 'error');
            
            // Revert the toggle
            await this.loadSettings();
        }
    }

    async handleReset() {
        try {
            console.log('[Popup] Resetting settings to defaults');
            
            this.showStatus('🔄', 'Resetting settings...', 'loading');
            
            const success = await this.settingsManager.resetToDefaults();
            
            if (success) {
                this.showStatus('✅', 'Settings reset to defaults', 'success');
                console.log('[Popup] Settings reset successfully');
                
                // Reload settings to update UI
                await this.loadSettings();
                
                // Notify content scripts about the reset
                await this.notifyContentScriptsReset();
                
            } else {
                this.showStatus('❌', 'Error resetting settings', 'error');
                console.error('[Popup] Failed to reset settings');
            }
            
            // Hide status after 3 seconds
            setTimeout(() => {
                this.hideStatus();
            }, 3000);
            
        } catch (error) {
            console.error('[Popup] Error resetting settings:', error);
            this.showStatus('❌', 'Error resetting settings', 'error');
        }
    }

    async notifyContentScripts(key, value) {
        try {
            // Send message to all google.com tabs to notify about setting change
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                const tabs = await chrome.tabs.query({ url: '*://www.google.com/*' });
                
                for (const tab of tabs) {
                    try {
                        await chrome.tabs.sendMessage(tab.id, {
                            type: 'SETTING_CHANGED',
                            key: key,
                            value: value
                        });
                    } catch (error) {
                        // Tab might not have content script loaded, ignore
                        console.log(`[Popup] Could not notify tab ${tab.id}:`, error.message);
                    }
                }
                
                console.log(`[Popup] Notified ${tabs.length} tabs about setting change`);
            }
        } catch (error) {
            console.error('[Popup] Error notifying content scripts:', error);
        }
    }

    async notifyContentScriptsReset() {
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                const tabs = await chrome.tabs.query({ url: '*://www.google.com/*' });
                
                for (const tab of tabs) {
                    try {
                        await chrome.tabs.sendMessage(tab.id, {
                            type: 'SETTINGS_RESET'
                        });
                    } catch (error) {
                        console.log(`[Popup] Could not notify tab ${tab.id} about reset:`, error.message);
                    }
                }
                
                console.log(`[Popup] Notified ${tabs.length} tabs about settings reset`);
            }
        } catch (error) {
            console.error('[Popup] Error notifying content scripts about reset:', error);
        }
    }

    showStatus(icon, text, type = '') {
        const statusMessage = document.getElementById('statusMessage');
        if (!statusMessage) return;

        const statusIcon = statusMessage.querySelector('.status-icon');
        const statusText = statusMessage.querySelector('.status-text');
        
        if (statusIcon) statusIcon.textContent = icon;
        if (statusText) {
            statusText.textContent = text;
            statusText.className = `status-text ${type}`;
        }

        // Add loading animation if needed
        if (type === 'loading') {
            statusMessage.classList.add('loading');
        } else {
            statusMessage.classList.remove('loading');
        }

        // Show status
        statusMessage.style.display = 'flex';
    }

    hideStatus() {
        const statusMessage = document.getElementById('statusMessage');
        if (!statusMessage) return;

        statusMessage.style.display = 'none';
        statusMessage.classList.remove('loading');
    }

    // Listen for messages from content scripts
    setupMessageListener() {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                console.log('[Popup] Received message:', message);
                
                if (message.type === 'POPUP_REFRESH_SETTINGS') {
                    this.loadSettings();
                    sendResponse({ success: true });
                }
                
                return true; // Keep message channel open for async response
            });
        }
    }
}

// Initialize popup when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PopupManager();
    });
} else {
    new PopupManager();
}

// Handle popup close
window.addEventListener('beforeunload', () => {
    console.log('[Popup] Popup closing');
});
