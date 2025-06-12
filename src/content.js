class AIOverviewExtractor {
    constructor() {
        this.webhookManager = new WebhookManager();
        this.settingsManager = new SettingsManager();
        this.settings = null;
        this.init();
    }

    async init() {
        console.log('[AI Overview Extractor] Initializing...');
        
        // Load settings
        this.settings = await this.settingsManager.getSettings();
        console.log('[AI Overview Extractor] Settings loaded:', this.settings);
        
        // Check immediately if container exists
        this.checkAndAddButton();
        
        // Observe DOM changes
        this.observeDOM();
    }

    async autoExpandAIOverview() {
        // Look for the "Show more" button with specific attributes
        const expandButton = document.querySelector('[aria-expanded="false"][aria-controls="m-x-content"]');
        
        if (expandButton) {
            console.log('[AI Overview Extractor] Auto-expanding AI overview');
            
            // Click the expand button
            expandButton.click();
            
            // Wait for expansion animation
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log('[AI Overview Extractor] AI overview expanded');
                    resolve(true);
                }, 800);
            });
        }
        
        console.log('[AI Overview Extractor] No collapsible AI overview found');
        return false;
    }

    observeDOM() {
        const observer = new MutationObserver(() => {
            this.checkAndAddButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[AI Overview Extractor] DOM Observer started');
    }

    async checkAndAddButton() {
        // Check if button already exists
        if (document.querySelector('.ai-extractor-button')) return;
        
        // Auto-expand AI overview if enabled
        if (this.settings && this.settings.autoExpandOverviews) {
            const expanded = await this.autoExpandAIOverview();
            if (expanded) {
                // Wait for expansion animation and check again
                setTimeout(() => this.checkAndAddButton(), 1000);
                return;
            }
        }
        
        // Look for #m-x-content
        const container = document.querySelector('#m-x-content');
        
        if (container) {
            console.log('[AI Overview Extractor] Found #m-x-content, adding button');
            this.addButton(container);
        }
    }

    addButton(container) {
        const button = document.createElement('button');
        button.className = 'ai-extractor-button';
        button.innerHTML = '📋 Extract to Markdown';
        
        button.addEventListener('click', () => {
            console.log('[AI Overview Extractor] Extraction button clicked');
            const content = this.extractContent(container);
            const sources = this.extractSources(container);
            const markdown = this.createMarkdown(content, sources);
            this.showPreview(markdown);
        });

        // Add button above container
        container.parentNode.insertBefore(button, container);
        console.log('[AI Overview Extractor] Button added');
    }

    extractContent(container) {
        console.log('[AI Overview Extractor] Ekstraktuję treść z:', container);

        // Stwórz kopię kontenera do manipulacji
        const clonedContainer = container.cloneNode(true);

        // Usuń elementy z data-subtree="msc"
        const mscElements = clonedContainer.querySelectorAll('div[data-subtree="msc"]');
        console.log(`[AI Overview Extractor] Znaleziono ${mscElements.length} elementów z data-subtree="msc"`);
        mscElements.forEach((element, index) => {
            element.remove();
            console.log(`[AI Overview Extractor] Usunięto element MSC ${index + 1}`);
        });

        // Usuń sekcję źródeł
        const sourcesElement = clonedContainer.querySelector('div[style="height: 100%;"]');
        if (sourcesElement) {
            sourcesElement.remove();
            console.log('[AI Overview Extractor] Usunięto sekcję źródeł');
        }

        // Usuń wszystkie elementy z style="display:none"
        const hiddenElements = clonedContainer.querySelectorAll('[style*="display:none"], [style*="display: none"]');
        console.log(`[AI Overview Extractor] Znaleziono ${hiddenElements.length} ukrytych elementów`);
        hiddenElements.forEach((element, index) => {
            element.remove();
            console.log(`[AI Overview Extractor] Usunięto ukryty element ${index + 1}`);
        });

        // Usuń wszystkie elementy <style>
        const styleElements = clonedContainer.querySelectorAll('style');
        console.log(`[AI Overview Extractor] Znaleziono ${styleElements.length} elementów <style>`);
        styleElements.forEach((element, index) => {
            element.remove();
            console.log(`[AI Overview Extractor] Usunięto element <style> ${index + 1}`);
        });

        // Usuń wszystkie elementy <script>
        const scriptElements = clonedContainer.querySelectorAll('script');
        console.log(`[AI Overview Extractor] Znaleziono ${scriptElements.length} elementów <script>`);
        scriptElements.forEach((element, index) => {
            element.remove();
            console.log(`[AI Overview Extractor] Usunięto element <script> ${index + 1}`);
        });

        // Usuń wszystkie atrybuty style z elementów
        const elementsWithStyle = clonedContainer.querySelectorAll('[style]');
        console.log(`[AI Overview Extractor] Znaleziono ${elementsWithStyle.length} elementów z atrybutem style`);
        elementsWithStyle.forEach((element) => {
            element.removeAttribute('style');
        });

        // Usuń wszystkie atrybuty class (często zawierają losowe identyfikatory)
        const elementsWithClass = clonedContainer.querySelectorAll('[class]');
        elementsWithClass.forEach((element) => {
            element.removeAttribute('class');
        });

        // Usuń inne niepotrzebne atrybuty
        const unwantedAttributes = ['data-ved', 'data-async-token', 'data-async-context', 'data-subtree', 'role', 'aria-level', 'jscontroller', 'jsaction', 'jsmodel', 'jsname'];
        clonedContainer.querySelectorAll('*').forEach((element) => {
            unwantedAttributes.forEach((attr) => {
                if (element.hasAttribute(attr)) {
                    element.removeAttribute(attr);
                }
            });
        });

        let cleanHTML = clonedContainer.innerHTML;

        // Usuń inline JavaScript (wzorce jak "(function(){...})()" itp.)
        cleanHTML = cleanHTML.replace(/\(function\(\)[^}]*\{[^}]*\}\)\(\);?/g, '');
        cleanHTML = cleanHTML.replace(/javascript:[^"']*/g, '');
        cleanHTML = cleanHTML.replace(/on\w+\s*=\s*["'][^"']*["']/g, '');

        // Usuń pozostałe fragmenty JS
        cleanHTML = cleanHTML.replace(/\(function\(\)\{[^}]*\}\)\(\);/g, '');
        cleanHTML = cleanHTML.replace(/var\s+\w+\s*=\s*[^;]*;/g, '');
        cleanHTML = cleanHTML.replace(/function\s*\([^)]*\)\s*\{[^}]*\}/g, '');

        // Usuń puste linie i nadmierne białe znaki
        cleanHTML = cleanHTML.replace(/^\s*[\r\n]/gm, '');
        cleanHTML = cleanHTML.replace(/\s{2,}/g, ' ');
        cleanHTML = cleanHTML.trim();

        console.log('[AI Overview Extractor] Oczyszczony HTML:', cleanHTML.substring(0, 200) + '...');

        return cleanHTML;
    }

    extractSources(container) {
        console.log('[AI Overview Extractor] Ekstraktuję źródła z:', container);

        const sourcesContainer = container.querySelector('div[style="height: 100%;"]');

        if (!sourcesContainer) {
            console.log('[AI Overview Extractor] Nie znaleziono kontenera źródeł [style="height: 100%;"]');
            return [];
        }

        console.log('[AI Overview Extractor] Znaleziono kontener źródeł:', sourcesContainer);

        const visibleSourceList = sourcesContainer.querySelector('ul[class]'); // Wybierz pierwszy ul, który ma atrybut class
        const links = visibleSourceList ? visibleSourceList.querySelectorAll('a[href]') : [];
        const sources = [];

        console.log(`[AI Overview Extractor] Znaleziono ${links.length} linków w widocznej liście źródeł`);

        links.forEach((link, index) => {
            const href = link.getAttribute('href');

            let text = link.textContent.trim();
            if (!text) {
                text = link.innerText?.trim() || '';
            }
            if (!text) {
                text = link.getAttribute('aria-label')?.trim() || '';
            }
            if (!text) {
                const textElements = link.querySelectorAll('*');
                for (let el of textElements) {
                    const elText = el.textContent?.trim();
                    if (elText && elText.length > text.length) {
                        text = elText;
                    }
                }
            }

            if (href &&
                !href.includes('google.com/search') &&
                !href.includes('support.google.com') &&
                !href.startsWith('#') &&
                text.length > 3) {

                const cleanUrl = this.cleanGoogleUrl(href);

                let title = text;
                if (!title || title.length < 3) {
                    try {
                        const url = new URL(cleanUrl);
                        title = url.hostname.replace('www.', '');
                    } catch (e) {
                        title = 'Unknown Source';
                    }
                }

                title = title.split('\n')[0].trim();
                if (title.length > 100) {
                    title = title.substring(0, 100) + '...';
                }

                sources.push({
                    title: title,
                    url: cleanUrl
                });
            }
        });

        const uniqueSources = sources.filter((source, index, self) =>
            index === self.findIndex(s => s.url === source.url)
        );

        console.log('[AI Overview Extractor] Unikalne źródła:', uniqueSources);
        return uniqueSources;
    }

    cleanGoogleUrl(url) {
        if (url.includes('/url?')) {
            try {
                const urlParams = new URLSearchParams(url.split('?')[1]);
                return urlParams.get('url') || url;
            } catch (e) {
                return url;
            }
        }
        return url;
    }

    createMarkdown(content, sources) {
        console.log('[AI Overview Extractor] Tworzę markdown z treścią i źródłami:', sources);

        // Wyciągnij słowo kluczowe z URL
        const searchQuery = this.extractSearchQuery();

        // Użyj Turndown do konwersji HTML na Markdown
        const turndownService = new TurndownService();

        // Dodaj regułę, aby ignorować obrazy
        turndownService.addRule('ignoreImages', {
            filter: 'img',
            replacement: function (content, node) {
                return '';
            }
        });

        // Dodaj regułę, aby ignorować linki w sekcji źródeł
        turndownService.addRule('ignoreSourceLinks', {
            filter: function (node) {
                // Sprawdź, czy węzeł jest linkiem i czy jest potomkiem elementu z klasą LLtSOc
                return node.nodeName === 'A' && node.closest('.LLtSOc');
            },
            replacement: function (content, node) {
                return ''; // Zastąp link pustym ciągiem
            }
        });

        let markdown = turndownService.turndown(content);

        // Add main header with search keyword
        let header = '# AI Overview';
        if (searchQuery) {
            header += `\n\n**Search Query:** ${searchQuery}`;
        }
        markdown = `${header}\n\n${markdown.trim()}\n`;

        if (sources && sources.length > 0) {
            console.log(`[AI Overview Extractor] Adding ${sources.length} sources to markdown`);
            markdown += '\n## Sources\n\n';
            sources.forEach((source, index) => {
                markdown += `${index + 1}. [**${source.title}**](${source.url})\n`;
            });
        } else {
            console.log('[AI Overview Extractor] No sources to add');
        }

        return markdown;
    }

    extractSearchQuery() {
        try {
            const url = new URL(window.location.href);
            const query = url.searchParams.get('q');
            if (query) {
                // Dekoduj URL i zamień + na spacje
                const decodedQuery = decodeURIComponent(query.replace(/\+/g, ' '));
                console.log('[AI Overview Extractor] Znalezione słowo kluczowe:', decodedQuery);
                return decodedQuery;
            }
        } catch (e) {
            console.log('[AI Overview Extractor] Błąd przy wyciąganiu słowa kluczowego:', e);
        }
        return null;
    }

    async showPreview(markdown) {
        const overlay = document.createElement('div');
        overlay.className = 'ai-extractor-overlay';
        
        // Stwórz elementy bezpiecznie bez innerHTML
        const modal = document.createElement('div');
        modal.className = 'ai-extractor-modal';
        
        const header = document.createElement('div');
        header.className = 'ai-extractor-header';
        
        const title = document.createElement('h3');
        title.textContent = 'AI Overview - Markdown';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ai-extractor-close';
        closeBtn.textContent = '❌ Close';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'ai-extractor-textarea';
        textarea.readOnly = true;
        textarea.value = markdown;
        
        // Sekcja webhook'ów
        const webhookSection = await this.createWebhookSection();
        
        const footer = document.createElement('div');
        footer.className = 'ai-extractor-footer';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ai-extractor-copy';
        copyBtn.textContent = '📋 Copy';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'ai-extractor-download';
        downloadBtn.textContent = '💾 Download';
        
        const webhookBtn = document.createElement('button');
        webhookBtn.className = 'ai-extractor-webhook';
        webhookBtn.textContent = '🚀 Send webhook';
        
        footer.appendChild(copyBtn);
        footer.appendChild(downloadBtn);
        footer.appendChild(webhookBtn);
        
        modal.appendChild(header);
        modal.appendChild(textarea);
        modal.appendChild(webhookSection);
        modal.appendChild(footer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event listeners
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(markdown).then(() => {
                this.showNotification('✅ Copied to clipboard!');
            }).catch(() => {
                this.showNotification('❌ Copy error');
            });
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadMarkdown(markdown);
        });

        webhookBtn.addEventListener('click', () => {
            this.handleWebhookSend(markdown);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    downloadMarkdown(markdown) {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-overview-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('✅ File downloaded!');
    }

    async createWebhookSection() {
        const section = document.createElement('div');
        section.className = 'ai-extractor-webhook-section';
        
        const webhookTitle = document.createElement('h4');
        webhookTitle.textContent = '🔗 Webhook Configuration';
        webhookTitle.style.margin = '10px 0 5px 0';
        webhookTitle.style.fontSize = '14px';
        
        const webhookContainer = document.createElement('div');
        webhookContainer.style.display = 'flex';
        webhookContainer.style.gap = '10px';
        webhookContainer.style.alignItems = 'center';
        
        const webhookInput = document.createElement('input');
        webhookInput.type = 'url';
        webhookInput.placeholder = 'https://your-webhook-url.com/endpoint';
        webhookInput.className = 'ai-extractor-webhook-input';
        webhookInput.style.flex = '1';
        webhookInput.style.padding = '8px';
        webhookInput.style.border = '1px solid #ddd';
        webhookInput.style.borderRadius = '4px';
        webhookInput.style.fontSize = '12px';
        
        // Wczytaj zapisany URL
        const savedUrl = await this.webhookManager.getWebhookUrl();
        if (savedUrl) {
            webhookInput.value = savedUrl;
        }
        
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 Test';
        testBtn.className = 'ai-extractor-test-webhook';
        testBtn.style.padding = '8px 12px';
        testBtn.style.fontSize = '12px';
        testBtn.style.border = '1px solid #007bff';
        testBtn.style.backgroundColor = '#007bff';
        testBtn.style.color = 'white';
        testBtn.style.borderRadius = '4px';
        testBtn.style.cursor = 'pointer';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Save';
        saveBtn.className = 'ai-extractor-save-webhook';
        saveBtn.style.padding = '8px 12px';
        saveBtn.style.fontSize = '12px';
        saveBtn.style.border = '1px solid #28a745';
        saveBtn.style.backgroundColor = '#28a745';
        saveBtn.style.color = 'white';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = 'ai-extractor-webhook-status';
        statusDiv.style.marginTop = '5px';
        statusDiv.style.fontSize = '12px';
        
        // Pokaż status
        const isConfigured = await this.webhookManager.isConfigured();
        statusDiv.textContent = isConfigured ? '✅ Webhook configured' : '⚠️ Webhook not configured';
        statusDiv.style.color = isConfigured ? '#28a745' : '#ffc107';
        
        // Event listeners
        saveBtn.addEventListener('click', async () => {
            const url = webhookInput.value.trim();
            if (!url) {
                statusDiv.textContent = '❌ Enter webhook URL';
                statusDiv.style.color = '#dc3545';
                return;
            }
            
            const saved = await this.webhookManager.saveWebhookUrl(url);
            if (saved) {
                statusDiv.textContent = '✅ Webhook saved';
                statusDiv.style.color = '#28a745';
                this.showNotification('✅ Webhook URL saved!');
            } else {
                statusDiv.textContent = '❌ Error saving webhook';
                statusDiv.style.color = '#dc3545';
                this.showNotification('❌ Error saving webhook URL');
            }
        });
        
        testBtn.addEventListener('click', async () => {
            const url = webhookInput.value.trim();
            if (!url) {
                statusDiv.textContent = '❌ Enter webhook URL to test';
                statusDiv.style.color = '#dc3545';
                return;
            }
            
            statusDiv.textContent = '🔄 Testing...';
            statusDiv.style.color = '#007bff';
            
            const result = await this.webhookManager.testWebhook(url);
            if (result.success) {
                statusDiv.textContent = '✅ Connection test successful';
                statusDiv.style.color = '#28a745';
                this.showNotification('✅ Webhook works correctly!');
            } else {
                statusDiv.textContent = `❌ Test failed: ${result.error}`;
                statusDiv.style.color = '#dc3545';
                this.showNotification('❌ Webhook test failed');
            }
        });
        
        webhookContainer.appendChild(webhookInput);
        webhookContainer.appendChild(testBtn);
        webhookContainer.appendChild(saveBtn);
        
        section.appendChild(webhookTitle);
        section.appendChild(webhookContainer);
        section.appendChild(statusDiv);
        
        return section;
    }

    async handleWebhookSend(markdown) {
        console.log('[AI Overview Extractor] Obsługuję wysyłanie webhook');
        
        // Przygotuj dane
        const container = document.querySelector('#m-x-content');
        if (!container) {
            this.showNotification('❌ Cannot find AI Overview container');
            return;
        }
        
        const htmlContent = this.extractContent(container);
        const sources = this.extractSources(container);
        const searchQuery = this.extractSearchQuery();
        
        const data = {
            searchQuery: searchQuery,
            content: markdown,
            htmlContent: htmlContent,
            sources: sources
        };
        
        // Wyślij do webhook
        const result = await this.webhookManager.sendToWebhook(data);
        
        if (result.success) {
            this.showNotification('✅ Data sent to webhook!');
        } else {
            this.showNotification(`❌ Webhook error: ${result.error}`);
            console.error('[AI Overview Extractor] Webhook error:', result.error);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ai-extractor-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
