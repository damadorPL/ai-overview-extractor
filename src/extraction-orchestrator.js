class ExtractionOrchestrator {
    constructor(webhookManager, settingsManager) {
        this.webhookManager = webhookManager;
        this.settingsManager = settingsManager;
        this.contentExtractor = new ContentExtractor();
        this.markdownGenerator = new MarkdownGenerator();
        this.uiManager = new UIManager(webhookManager);
    }

    async handleExtraction(container) {
        console.log('[ExtractionOrchestrator] Starting extraction process');
        
        try {
            // Extract content and sources
            const htmlContent = this.contentExtractor.extractContent(container);
            const sources = this.contentExtractor.extractSources(container);
            const searchQuery = this.contentExtractor.extractSearchQuery();
            
            // Generate markdown
            const markdown = this.markdownGenerator.createMarkdown(htmlContent, sources, searchQuery);
            
            // Show preview with webhook callback
            await this.uiManager.showPreview(markdown, (markdown) => {
                this.handleWebhookSend(container, markdown);
            });
            
            console.log('[ExtractionOrchestrator] Extraction completed successfully');
            return true;
        } catch (error) {
            console.error('[ExtractionOrchestrator] Error during extraction:', error);
            this.uiManager.showNotification('❌ Extraction error');
            return false;
        }
    }

    async handleWebhookSend(container, markdown) {
        console.log('[ExtractionOrchestrator] Handling webhook send');
        
        try {
            // Prepare data for webhook
            const htmlContent = this.contentExtractor.extractContent(container);
            const sources = this.contentExtractor.extractSources(container);
            const searchQuery = this.contentExtractor.extractSearchQuery();
            
            const data = {
                searchQuery: searchQuery,
                content: markdown,
                htmlContent: htmlContent,
                sources: sources,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };
            
            // Send to webhook
            const result = await this.webhookManager.sendToWebhook(data);
            
            if (result.success) {
                this.uiManager.showNotification('✅ Data sent to webhook!');
                console.log('[ExtractionOrchestrator] Webhook sent successfully');
            } else {
                this.uiManager.showNotification(`❌ Webhook error: ${result.error}`);
                console.error('[ExtractionOrchestrator] Webhook error:', result.error);
            }
            
            return result.success;
        } catch (error) {
            console.error('[ExtractionOrchestrator] Error sending webhook:', error);
            this.uiManager.showNotification('❌ Webhook send error');
            return false;
        }
    }
}
