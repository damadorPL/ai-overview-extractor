class UIManager {
    constructor(webhookManager) {
        this.webhookManager = webhookManager;
    }

    async showPreview(markdown, onWebhookSend) {
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
            const markdownGenerator = new MarkdownGenerator();
            markdownGenerator.downloadMarkdown(markdown);
            this.showNotification('✅ File downloaded!');
        });

        webhookBtn.addEventListener('click', () => {
            if (onWebhookSend) {
                onWebhookSend(markdown);
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
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
