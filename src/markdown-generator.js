class MarkdownGenerator {
    constructor() {
        this.turndownService = this.initializeTurndown();
    }

    initializeTurndown() {
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

        return turndownService;
    }

    createMarkdown(htmlContent, sources, searchQuery = null) {
        console.log('[MarkdownGenerator] Tworzę markdown z treścią i źródłami:', sources);

        let markdown = this.turndownService.turndown(htmlContent);

        // Add main header with search keyword
        let header = '# AI Overview';
        if (searchQuery) {
            header += `\n\n**Search Query:** ${searchQuery}`;
        }
        markdown = `${header}\n\n${markdown.trim()}\n`;

        if (sources && sources.length > 0) {
            console.log(`[MarkdownGenerator] Adding ${sources.length} sources to markdown`);
            markdown += '\n## Sources\n\n';
            sources.forEach((source, index) => {
                markdown += `${index + 1}. [**${source.title}**](${source.url})\n`;
            });
        } else {
            console.log('[MarkdownGenerator] No sources to add');
        }

        return markdown;
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
        
        console.log('[MarkdownGenerator] File downloaded');
        return true;
    }
}
