class WebhookManager {
    constructor() {
        this.storageKey = 'ai-overview-webhook-url';
        this.timeout = 5000; // 5 seconds timeout
    }

    /**
     * Saves webhook URL to localStorage
     * @param {string} webhookUrl - Webhook URL
     * @returns {boolean} - whether operation succeeded
     */
    async saveWebhookUrl(webhookUrl) {
        try {
            if (!this.isValidWebhookUrl(webhookUrl)) {
                console.error('[Webhook Manager] Invalid webhook URL:', webhookUrl);
                return false;
            }

            // Używamy chrome.storage.local jeśli dostępne, fallback na localStorage
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ [this.storageKey]: webhookUrl });
            } else {
                localStorage.setItem(this.storageKey, webhookUrl);
            }

            console.log('[Webhook Manager] URL webhook zapisany:', webhookUrl);
            return true;
        } catch (error) {
            console.error('[Webhook Manager] Błąd zapisywania URL webhook:', error);
            return false;
        }
    }

    /**
     * Pobiera URL webhook'a z localStorage
     * @returns {Promise<string|null>} - URL webhook'a lub null
     */
    async getWebhookUrl() {
        try {
            // Używamy chrome.storage.local jeśli dostępne, fallback na localStorage
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get([this.storageKey]);
                return result[this.storageKey] || null;
            } else {
                return localStorage.getItem(this.storageKey);
            }
        } catch (error) {
            console.error('[Webhook Manager] Błąd pobierania URL webhook:', error);
            return null;
        }
    }

    /**
     * Usuwa URL webhook'a
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async removeWebhookUrl() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.remove([this.storageKey]);
            } else {
                localStorage.removeItem(this.storageKey);
            }

            console.log('[Webhook Manager] URL webhook usunięty');
            return true;
        } catch (error) {
            console.error('[Webhook Manager] Błąd usuwania URL webhook:', error);
            return false;
        }
    }

    /**
     * Waliduje URL webhook'a
     * @param {string} url - URL do walidacji
     * @returns {boolean} - czy URL jest prawidłowy
     */
    isValidWebhookUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        try {
            const urlObj = new URL(url);
            // Wymagamy HTTPS dla bezpieczeństwa (z wyjątkiem localhost do testów)
            if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost')) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Testuje połączenie z webhook'iem
     * @param {string} webhookUrl - URL webhook'a do przetestowania
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async testWebhook(webhookUrl) {
        try {
            if (!this.isValidWebhookUrl(webhookUrl)) {
                return { 
                    success: false, 
                    error: 'Nieprawidłowy URL webhook. Wymagany format: https://...' 
                };
            }

            const testPayload = {
                test: true,
                timestamp: new Date().toISOString(),
                message: 'Test połączenia z AI Overview Extractor'
            };

            const response = await this.makeRequest(webhookUrl, testPayload);
            
            if (response.success) {
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: response.error || 'Nieprawidłowa odpowiedź z webhook\'a' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: `Błąd połączenia: ${error.message}` 
            };
        }
    }

    /**
     * Wysyła dane AI Overview do webhook'a
     * @param {Object} data - dane do wysłania
     * @param {string} data.searchQuery - słowo kluczowe
     * @param {string} data.content - treść markdown
     * @param {string} data.htmlContent - surowy HTML
     * @param {Array} data.sources - źródła
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async sendToWebhook(data) {
        try {
            const webhookUrl = await this.getWebhookUrl();
            
            if (!webhookUrl) {
                return { 
                    success: false, 
                    error: 'Webhook nie jest skonfigurowany. Ustaw URL webhook w ustawieniach.' 
                };
            }

            const payload = this.createPayload(data);
            console.log('[Webhook Manager] Wysyłam dane do webhook:', webhookUrl);
            
            const response = await this.makeRequest(webhookUrl, payload);
            
            if (response.success) {
                console.log('[Webhook Manager] Dane wysłane pomyślnie');
                return { success: true };
            } else {
                console.error('[Webhook Manager] Błąd wysyłania:', response.error);
                return { 
                    success: false, 
                    error: response.error || 'Nieznany błąd webhook\'a' 
                };
            }
        } catch (error) {
            console.error('[Webhook Manager] Błąd wysyłania do webhook:', error);
            return { 
                success: false, 
                error: `Błąd połączenia: ${error.message}` 
            };
        }
    }

    /**
     * Tworzy payload do wysłania
     * @param {Object} data - dane wejściowe
     * @returns {Object} - sformatowany payload
     */
    createPayload(data) {
        const now = new Date().toISOString();
        
        return {
            timestamp: now,
            searchQuery: data.searchQuery || null,
            aiOverview: {
                content: data.content || '',
                htmlContent: data.htmlContent || ''
            },
            sources: data.sources || [],
            metadata: {
                googleSearchUrl: window.location.href,
                extractedAt: now,
                userAgent: navigator.userAgent,
                extensionVersion: '1.0.4'
            }
        };
    }

    /**
     * Wykonuje request HTTP z timeout'em
     * @param {string} url - URL webhook'a
     * @param {Object} payload - dane do wysłania
     * @returns {Promise<{success: boolean, error?: string, response?: any}>}
     */
    async makeRequest(url, payload) {
        return new Promise((resolve) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                resolve({ 
                    success: false, 
                    error: `Timeout - webhook nie odpowiedział w ciągu ${this.timeout/1000}s` 
                });
            }, this.timeout);

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            })
            .then(async response => {
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const responseData = await response.text();
                    resolve({ 
                        success: true, 
                        response: responseData 
                    });
                } else {
                    resolve({ 
                        success: false, 
                        error: `HTTP ${response.status}: ${response.statusText}` 
                    });
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    return; // timeout już obsłużony
                }
                resolve({ 
                    success: false, 
                    error: error.message 
                });
            });
        });
    }

    /**
     * Sprawdza czy webhook jest skonfigurowany
     * @returns {Promise<boolean>}
     */
    async isConfigured() {
        const url = await this.getWebhookUrl();
        return !!url;
    }
}

// Export dla użycia w content.js
window.WebhookManager = WebhookManager;
