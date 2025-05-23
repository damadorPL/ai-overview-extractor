class AIOverviewExtractor {
    constructor() {
        this.init();
    }

    init() {
        console.log('Inicjalizuję AI Overview Extractor...');
        
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
        
        console.log('Observer DOM uruchomiony');
    }

    checkAndAddButton() {
        // Sprawdź czy przycisk już istnieje
        if (document.querySelector('.ai-extractor-button')) return;
        
        // Szukaj #m-x-content
        const container = document.querySelector('#m-x-content');
        
        if (container) {
            console.log('Znaleziono #m-x-content, dodaję przycisk');
            this.addButton(container);
        }
    }

    addButton(container) {
        const button = document.createElement('button');
        button.className = 'ai-extractor-button';
        button.innerHTML = '📋 Ekstraktuj do Markdown';
        button.style.cssText = `
            position: relative;
            margin: 10px 0;
            padding: 10px 20px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 1000;
        `;
        
        button.addEventListener('click', () => {
            console.log('Kliknięto przycisk ekstrakcji');
            const content = this.extractContent(container);
            const sources = this.extractSources(container);
            const markdown = this.createMarkdown(content, sources);
            this.showPreview(markdown);
        });

        // Dodaj przycisk nad kontenerem
        container.parentNode.insertBefore(button, container);
        console.log('Przycisk dodany');
    }

    extractContent(container) {
        console.log('Ekstraktuję treść z:', container);
        
        // Po prostu weź cały tekst z kontenera
        const rawText = container.textContent || container.innerText || '';
        
        console.log('Surowy tekst:', rawText.substring(0, 200) + '...');
        
        // Oczyść komunikaty błędów i niepotrzebne elementy
        let cleaned = this.cleanText(rawText);
        
        return cleaned;
    }

    extractSources(container) {
        console.log('Ekstraktuję źródła z:', container);
        
        // Znajdź sekcję z linkami - ma dokładnie style="height:100%"
        const sourcesContainer = container.querySelector('div[style="height:100%"]');
        
        if (!sourcesContainer) {
            console.log('Nie znaleziono kontenera źródeł [style="height:100%"]');
            return [];
        }
        
        console.log('Znaleziono kontener źródeł:', sourcesContainer);
        
        // Znajdź wszystkie linki w tej sekcji
        const links = sourcesContainer.querySelectorAll('a[href]');
        const sources = [];
        
        console.log(`Znaleziono ${links.length} linków w kontenerze źródeł`);
        
        links.forEach((link, index) => {
            const href = link.getAttribute('href');
            
            // Spróbuj różnych sposobów wyciągnięcia tekstu
            let text = link.textContent.trim();
            if (!text) {
                text = link.innerText?.trim() || '';
            }
            if (!text) {
                // Spróbuj wyciągnąć z aria-label
                text = link.getAttribute('aria-label')?.trim() || '';
            }
            if (!text) {
                // Spróbuj znaleźć tekst w dzieciach
                const textElements = link.querySelectorAll('*');
                for (let el of textElements) {
                    const elText = el.textContent?.trim();
                    if (elText && elText.length > text.length) {
                        text = elText;
                    }
                }
            }
            
            console.log(`Link ${index}: "${text}" -> ${href}`);
            console.log(`  - długość tekstu: ${text.length}`);
            
            // Luźniejsze warunki - zmniejsz wymagania
            if (href && 
                !href.includes('google.com/search') && 
                !href.includes('support.google.com') && 
                !href.startsWith('#') &&
                text.length > 3) {  // Zmienione z 10 na 3
                
                console.log(`  - AKCEPTUJĘ ten link!`);
                
                // Oczyść URL z Google redirect
                const cleanUrl = this.cleanGoogleUrl(href);
                
                // Jeśli nie ma tekstu, użyj domeny jako tytułu
                let title = text;
                if (!title || title.length < 3) {
                    try {
                        const url = new URL(cleanUrl);
                        title = url.hostname.replace('www.', '');
                    } catch (e) {
                        title = 'Unknown Source';
                    }
                }
                
                // Weź pierwszy kawałek tekstu jako tytuł
                title = title.split('\n')[0].trim();
                if (title.length > 100) {
                    title = title.substring(0, 100) + '...';
                }
                
                sources.push({
                    title: title,
                    url: cleanUrl
                });
            } else {
                console.log(`  - ODRZUCAM ten link! (długość: ${text.length})`);
            }
        });
        
        // Usuń duplikaty po URL
        const uniqueSources = sources.filter((source, index, self) => 
            index === self.findIndex(s => s.url === source.url)
        );
        
        console.log('Unikalne źródła:', uniqueSources);
        return uniqueSources;
    }

    cleanGoogleUrl(url) {
        // Usuń Google redirect
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
        console.log('Tworzę markdown z treścią i źródłami:', sources);
        
        // Sformatuj treść
        let markdown = this.formatAsMarkdown(content);
        
        // Dodaj źródła
        if (sources && sources.length > 0) {
            console.log(`Dodaję ${sources.length} źródeł do markdown`);
            markdown += '\n## Źródła\n\n';
            sources.forEach((source, index) => {
                markdown += `${index + 1}. [${source.title}](${source.url})\n`;
            });
        } else {
            console.log('Brak źródeł do dodania');
        }
        
        return markdown;
    }

    cleanText(text) {
        // Usuń komunikaty błędów z początku
        let cleaned = text;
        
        // Usuń blok komunikatów błędów
        cleaned = cleaned.replace(/Przegląd od AI nie jest dostępny.*?Więcej informacji/gs, '');
        
        // Usuń elementy UI na końcu
        cleaned = cleaned.replace(/Generatywna AI ma charakter eksperymentalny.*$/gs, '');
        cleaned = cleaned.replace(/Dziękujemy.*Zamknij$/gs, '');
        
        // Znajdź początek właściwej treści (zaczyna się od "Kindergeld")
        const contentStart = cleaned.indexOf('Kindergeld (niemiecki zasiłek rodzinny)');
        if (contentStart !== -1) {
            cleaned = cleaned.substring(contentStart);
        }
        
        // Znajdź koniec właściwej treści (przed linkami źródeł)
        const linksStart = cleaned.indexOf('Kindergeld Pozyskiwanie Odzyskiwanie Zwrot -');
        if (linksStart !== -1) {
            cleaned = cleaned.substring(0, linksStart);
        }
        
        // Podstawowe czyszczenie
        cleaned = cleaned
            .replace(/\s+/g, ' ')  // Usuń wielokrotne spacje
            .trim();
        
        return cleaned;
    }

    formatAsMarkdown(text) {
        let markdown = text;
        
        // Dodaj nagłówki dla sekcji
        markdown = markdown.replace(/Wysokość Kindergeld:/g, '\n## Wysokość Kindergeld\n');
        markdown = markdown.replace(/Warunki, aby otrzymać Kindergeld:/g, '\n## Warunki, aby otrzymać Kindergeld\n');
        markdown = markdown.replace(/Pomoc w uzyskaniu Kindergeld:/g, '\n## Pomoc w uzyskaniu Kindergeld\n');
        markdown = markdown.replace(/Dodatkowe informacje:/g, '\n## Dodatkowe informacje\n');
        
        // Dodaj punkty dla list (gdzie są zdania po sobie)
        markdown = markdown.replace(/(\. )([A-ZĄĆĘŁŃÓŚŹŻ])/g, '.\n\n- $2');
        
        // Oczyść wielokrotne nowe linie
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        
        // Dodaj główny nagłówek
        markdown = `# AI Overview: Kindergeld\n\n${markdown.trim()}\n`;
        
        return markdown;
    }

    showPreview(markdown) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                min-width: 600px;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">Markdown Podgląd</h3>
                    <button class="close-btn" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 14px;
                    ">❌ Zamknij</button>
                </div>
                <textarea readonly style="
                    width: 100%;
                    height: 400px;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    resize: vertical;
                    background: #f9f9f9;
                ">${markdown}</textarea>
                <div style="margin-top: 12px; text-align: right;">
                    <button class="copy-btn" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 10px 20px;
                        cursor: pointer;
                        font-size: 14px;
                    ">📋 Kopiuj</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event listeners
        overlay.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(markdown).then(() => {
                alert('Skopiowano!');
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
}

// Uruchom
new AIOverviewExtractor();