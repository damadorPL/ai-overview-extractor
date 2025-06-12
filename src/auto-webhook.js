class AutoWebhook {
    constructor(settingsManager, webhookManager) {
        this.settingsManager = settingsManager;
        this.webhookManager = webhookManager;
        this.isReady = false;
        this.contentExtractor = new ContentExtractor();
        this.markdownGenerator = new MarkdownGenerator();
        console.log('[AutoWebhook] Initialized');
    }

    // Sygnalizuje że moduł może rozpocząć pracę (wywoływane po zakończeniu rozwijania)
    setReady() {
        this.isReady = true;
        console.log('[AutoWebhook] Ready to send webhook');
    }

    // Główna metoda automatycznego wysyłania webhook
    async autoSendWebhook() {
        try {
            const settings = await this.settingsManager.getSettings();
            if (!settings.autoSendWebhook) {
                console.log('[AutoWebhook] Auto-send webhook is disabled');
                return false;
            }

            // Sprawdź czy webhook jest skonfigurowany
            const isConfigured = await this.webhookManager.isConfigured();
            if (!isConfigured) {
                console.log('[AutoWebhook] Webhook not configured, skipping auto-send');
                return false;
            }

            // Czekaj aż poprzednie moduły dadzą sygnał gotowości
            if (!this.isReady) {
                console.log('[AutoWebhook] Waiting for expansions to complete...');
                await this.waitForReady();
            }

            // Dodatkowe opóźnienie na załadowanie treści
            await this.delay(1000);

            // Sprawdź czy AI Overview container istnieje
            const container = document.querySelector('#m-x-content');
            if (!container) {
                console.log('[AutoWebhook] AI Overview container not found');
                return false;
            }

            console.log('[AutoWebhook] Preparing webhook data...');

            // Przygotuj dane do wysłania
            const webhookData = await this.prepareWebhookData(container);
            
            if (!webhookData) {
                console.log('[AutoWebhook] Failed to prepare webhook data');
                return false;
            }

            console.log('[AutoWebhook] Sending webhook...');

            // Wyślij webhook
            const result = await this.webhookManager.sendToWebhook(webhookData);
            
            if (result.success) {
                console.log('[AutoWebhook] Webhook sent successfully');
                this.showNotification('✅ Auto-webhook sent!');
                return true;
            } else {
                console.error('[AutoWebhook] Webhook send failed:', result.error);
                this.showNotification(`❌ Auto-webhook failed: ${result.error}`);
                return false;
            }

        } catch (error) {
            console.error('[AutoWebhook] Error in autoSendWebhook:', error);
            this.showNotification('❌ Auto-webhook error');
            return false;
        }
    }

    // Przygotowuje dane do webhook
    async prepareWebhookData(container) {
        try {
            // Użyj ContentExtractor i MarkdownGenerator do ekstrakcji danych
            const htmlContent = this.contentExtractor.extractContent(container);
            const sources = this.contentExtractor.extractSources(container);
            const searchQuery = this.contentExtractor.extractSearchQuery();
            const markdown = this.markdownGenerator.createMarkdown(htmlContent, sources, searchQuery);

            console.log('[AutoWebhook] Data prepared successfully');

            return {
                searchQuery: searchQuery,
                content: markdown,
                htmlContent: htmlContent,
                sources: sources,
                timestamp: new Date().toISOString(),
                autoSent: true,
                url: window.location.href
            };
        } catch (error) {
            console.error('[AutoWebhook] Error preparing webhook data:', error);
            return null;
        }
    }

    // Czeka aż poprzednie moduły dadzą sygnał gotowości
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

    // Pomocnicza funkcja opóźnienia
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Pokazuje powiadomienie użytkownikowi
    showNotification(message) {
        try {
            // Sprawdź czy metoda showNotification jest dostępna w aiExtractor
            if (window.aiExtractor && typeof window.aiExtractor.showNotification === 'function') {
                window.aiExtractor.showNotification(message);
            } else {
                // Fallback - prosty console.log
                console.log('[AutoWebhook] Notification:', message);
                
                // Możemy dodać prostą notyfikację w przyszłości
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.right = '20px';
                notification.style.backgroundColor = '#333';
                notification.style.color = 'white';
                notification.style.padding = '10px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '10000';
                notification.style.fontSize = '14px';
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('[AutoWebhook] Error showing notification:', error);
        }
    }

    // Sprawdza czy webhook jest gotowy do działania
    async isReadyToSend() {
        const settings = await this.settingsManager.getSettings();
        const isConfigured = await this.webhookManager.isConfigured();
        
        return settings.autoSendWebhook && isConfigured && this.isReady;
    }
}

// Eksportuj klasę dla innych modułów
window.AutoWebhook = AutoWebhook;
