class AIOverviewExtractor {
    constructor() {
        this.init();
    }

    init() {
        console.log('[AI Overview Extractor] Inicjalizuję...');
        
        // Sprawdź od razu czy jest kontener
        this.checkAndAddButton();
        
        // Obserwuj zmiany w DOM
        this.observeDOM();
    }

    observeDOM() {
        const observer = new MutationObserver(() => {
            this.checkAndAddButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[AI Overview Extractor] Observer DOM uruchomiony');
    }

    checkAndAddButton() {
        // Sprawdź czy przycisk już istnieje
        if (document.querySelector('.ai-extractor-button')) return;
        
        // Szukaj #m-x-content
        const container = document.querySelector('#m-x-content');
        
        if (container) {
            console.log('[AI Overview Extractor] Znaleziono #m-x-content, dodaję przycisk');
            this.addButton(container);
        }
    }

    addButton(container) {
        const button = document.createElement('button');
        button.className = 'ai-extractor-button';
        button.innerHTML = '📋 Ekstraktuj do Markdown';
        
        button.addEventListener('click', () => {
            console.log('[AI Overview Extractor] Kliknięto przycisk ekstrakcji');
            const content = this.extractContent(container);
            const sources = this.extractSources(container);
            const markdown = this.createMarkdown(content, sources);
            this.showPreview(markdown);
        });

        // Dodaj przycisk nad kontenerem
        container.parentNode.insertBefore(button, container);
        console.log('[AI Overview Extractor] Przycisk dodany');
    }

    extractContent(container) {
        console.log('[AI Overview Extractor] Ekstraktuję treść z:', container);

        const sourcesElement = container.querySelector('div[style="height: 100%;"]');
        let rawHTML = container.innerHTML;

        if (sourcesElement) {
            const sourcesOuterHTML = sourcesElement.outerHTML;
            const sourcesIndex = rawHTML.indexOf(sourcesOuterHTML);
            if (sourcesIndex !== -1) {
                rawHTML = rawHTML.substring(0, sourcesIndex);
            }
        }

        console.log('[AI Overview Extractor] Surowy HTML (po usunięciu źródeł):', rawHTML.substring(0, 200) + '...');

        return rawHTML;
    }

    extractSources(container) {
        console.log('[AI Overview Extractor] Ekstraktuję źródła z:', container);

        const sourcesContainer = container.querySelector('div[style="height: 100%;"]');

        if (!sourcesContainer) {
            console.log('[AI Overview Extractor] Nie znaleziono kontenera źródeł [style="height: 100%;"]');
            return [];
        }

        console.log('[AI Overview Extractor] Znaleziono kontener źródeł:', sourcesContainer);

        const links = sourcesContainer.querySelectorAll('a[href]');
        const sources = [];

        console.log(`[AI Overview Extractor] Znaleziono ${links.length} linków w kontenerze źródeł`);

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

        // Dodaj główny nagłówek
        markdown = `# AI Overview\n\n${markdown.trim()}\n`;

        if (sources && sources.length > 0) {
            console.log(`[AI Overview Extractor] Dodaję ${sources.length} źródeł do markdown`);
            markdown += '\n## Źródła\n\n';
            sources.forEach((source, index) => {
                markdown += `${index + 1}. [**${source.title}**](${source.url})\n`;
            });
        } else {
            console.log('[AI Overview Extractor] Brak źródeł do dodania');
        }

        return markdown;
    }

    showPreview(markdown) {
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
        closeBtn.textContent = '❌ Zamknij';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'ai-extractor-textarea';
        textarea.readOnly = true;
        textarea.value = markdown;
        
        const footer = document.createElement('div');
        footer.className = 'ai-extractor-footer';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ai-extractor-copy';
        copyBtn.textContent = '📋 Kopiuj';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'ai-extractor-download';
        downloadBtn.textContent = '💾 Pobierz';
        
        footer.appendChild(copyBtn);
        footer.appendChild(downloadBtn);
        
        modal.appendChild(header);
        modal.appendChild(textarea);
        modal.appendChild(footer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event listeners
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(markdown).then(() => {
                this.showNotification('✅ Skopiowano do schowka!');
            }).catch(() => {
                this.showNotification('❌ Błąd kopiowania');
            });
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadMarkdown(markdown);
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
        
        this.showNotification('✅ Plik pobrany!');
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

// Uruchom wtyczkę
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AIOverviewExtractor();
    });
} else {
    new AIOverviewExtractor();
}
