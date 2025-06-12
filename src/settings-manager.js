class SettingsManager {
    constructor() {
        this.storageKey = 'ai-overview-settings';
        this.defaultSettings = {
            autoExpandOverviews: false,
            autoExpandSources: false,
            autoSendWebhook: false
        };
    }

    /**
     * Pobiera wszystkie ustawienia
     * @returns {Promise<Object>} - obiekt z ustawieniami
     */
    async getSettings() {
        try {
            // Używamy chrome.storage.local jeśli dostępne, fallback na localStorage
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const result = await chrome.storage.local.get([this.storageKey]);
                const settings = result[this.storageKey];
                
                if (settings) {
                    // Merge z defaultami w przypadku nowych ustawień
                    return { ...this.defaultSettings, ...settings };
                }
            } else {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    const settings = JSON.parse(stored);
                    return { ...this.defaultSettings, ...settings };
                }
            }
            
            // Jeśli brak zapisanych ustawień, zwróć domyślne
            await this.saveSettings(this.defaultSettings);
            return this.defaultSettings;
            
        } catch (error) {
            console.error('[Settings Manager] Błąd pobierania ustawień:', error);
            return this.defaultSettings;
        }
    }

    /**
     * Zapisuje wszystkie ustawienia
     * @param {Object} settings - obiekt z ustawieniami
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async saveSettings(settings) {
        try {
            const mergedSettings = { ...this.defaultSettings, ...settings };
            
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ [this.storageKey]: mergedSettings });
            } else {
                localStorage.setItem(this.storageKey, JSON.stringify(mergedSettings));
            }

            console.log('[Settings Manager] Ustawienia zapisane:', mergedSettings);
            return true;
        } catch (error) {
            console.error('[Settings Manager] Błąd zapisywania ustawień:', error);
            return false;
        }
    }

    /**
     * Zapisuje pojedyncze ustawienie
     * @param {string} key - klucz ustawienia
     * @param {*} value - wartość ustawienia
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async saveSetting(key, value) {
        try {
            const settings = await this.getSettings();
            settings[key] = value;
            return await this.saveSettings(settings);
        } catch (error) {
            console.error('[Settings Manager] Błąd zapisywania ustawienia:', error);
            return false;
        }
    }

    /**
     * Pobiera pojedyncze ustawienie
     * @param {string} key - klucz ustawienia
     * @returns {Promise<*>} - wartość ustawienia
     */
    async getSetting(key) {
        try {
            const settings = await this.getSettings();
            return settings[key] !== undefined ? settings[key] : this.defaultSettings[key];
        } catch (error) {
            console.error('[Settings Manager] Błąd pobierania ustawienia:', error);
            return this.defaultSettings[key];
        }
    }

    /**
     * Resetuje ustawienia do domyślnych
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async resetToDefaults() {
        try {
            return await this.saveSettings(this.defaultSettings);
        } catch (error) {
            console.error('[Settings Manager] Błąd resetowania ustawień:', error);
            return false;
        }
    }

    /**
     * Usuwa wszystkie ustawienia
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async clearSettings() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.remove([this.storageKey]);
            } else {
                localStorage.removeItem(this.storageKey);
            }

            console.log('[Settings Manager] Ustawienia usunięte');
            return true;
        } catch (error) {
            console.error('[Settings Manager] Błąd usuwania ustawień:', error);
            return false;
        }
    }

    /**
     * Nasłuchuje zmian w ustawieniach
     * @param {Function} callback - funkcja wywoływana przy zmianie ustawień
     */
    onSettingsChanged(callback) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'local' && changes[this.storageKey]) {
                    const newSettings = changes[this.storageKey].newValue;
                    const oldSettings = changes[this.storageKey].oldValue;
                    callback(newSettings, oldSettings);
                }
            });
        }
    }

    /**
     * Waliduje ustawienia
     * @param {Object} settings - ustawienia do walidacji
     * @returns {boolean} - czy ustawienia są prawidłowe
     */
    validateSettings(settings) {
        if (!settings || typeof settings !== 'object') {
            return false;
        }

        const requiredKeys = Object.keys(this.defaultSettings);
        for (const key of requiredKeys) {
            if (!(key in settings)) {
                return false;
            }
            
            // Sprawdź typy
            if (typeof settings[key] !== typeof this.defaultSettings[key]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Eksportuje ustawienia do JSON
     * @returns {Promise<string>} - JSON z ustawieniami
     */
    async exportSettings() {
        try {
            const settings = await this.getSettings();
            return JSON.stringify(settings, null, 2);
        } catch (error) {
            console.error('[Settings Manager] Błąd eksportu ustawień:', error);
            return null;
        }
    }

    /**
     * Importuje ustawienia z JSON
     * @param {string} jsonString - JSON z ustawieniami
     * @returns {Promise<boolean>} - czy operacja się powiodła
     */
    async importSettings(jsonString) {
        try {
            const settings = JSON.parse(jsonString);
            
            if (this.validateSettings(settings)) {
                return await this.saveSettings(settings);
            } else {
                console.error('[Settings Manager] Nieprawidłowe ustawienia do importu');
                return false;
            }
        } catch (error) {
            console.error('[Settings Manager] Błąd importu ustawień:', error);
            return false;
        }
    }
}

// Export dla użycia w content.js i popup.js
window.SettingsManager = SettingsManager;
