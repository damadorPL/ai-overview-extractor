class ContentExtractor {
    constructor() {
        // This class handles extraction of content and sources from AI Overview containers
    }

    extractContent(container) {
        console.log('[ContentExtractor] Ekstraktuję treść z:', container);

        // Stwórz kopię kontenera do manipulacji
        const clonedContainer = container.cloneNode(true);

        // Usuń elementy z data-subtree="msc"
        const mscElements = clonedContainer.querySelectorAll('div[data-subtree="msc"]');
        console.log(`[ContentExtractor] Znaleziono ${mscElements.length} elementów z data-subtree="msc"`);
        mscElements.forEach((element, index) => {
            element.remove();
            console.log(`[ContentExtractor] Usunięto element MSC ${index + 1}`);
        });

        // Usuń sekcję źródeł
        const sourcesElement = clonedContainer.querySelector('div[style="height: 100%;"]');
        if (sourcesElement) {
            sourcesElement.remove();
            console.log('[ContentExtractor] Usunięto sekcję źródeł');
        }

        // Usuń wszystkie elementy z style="display:none"
        const hiddenElements = clonedContainer.querySelectorAll('[style*="display:none"], [style*="display: none"]');
        console.log(`[ContentExtractor] Znaleziono ${hiddenElements.length} ukrytych elementów`);
        hiddenElements.forEach((element, index) => {
            element.remove();
            console.log(`[ContentExtractor] Usunięto ukryty element ${index + 1}`);
        });

        // Usuń wszystkie elementy <style>
        const styleElements = clonedContainer.querySelectorAll('style');
        console.log(`[ContentExtractor] Znaleziono ${styleElements.length} elementów <style>`);
        styleElements.forEach((element, index) => {
            element.remove();
            console.log(`[ContentExtractor] Usunięto element <style> ${index + 1}`);
        });

        // Usuń wszystkie elementy <script>
        const scriptElements = clonedContainer.querySelectorAll('script');
        console.log(`[ContentExtractor] Znaleziono ${scriptElements.length} elementów <script>`);
        scriptElements.forEach((element, index) => {
            element.remove();
            console.log(`[ContentExtractor] Usunięto element <script> ${index + 1}`);
        });

        // Usuń wszystkie atrybuty style z elementów
        const elementsWithStyle = clonedContainer.querySelectorAll('[style]');
        console.log(`[ContentExtractor] Znaleziono ${elementsWithStyle.length} elementów z atrybutem style`);
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

        console.log('[ContentExtractor] Oczyszczony HTML:', cleanHTML.substring(0, 200) + '...');

        return cleanHTML;
    }

    extractSources(container) {
        console.log('[ContentExtractor] Ekstraktuję źródła z:', container);

        const sourcesContainer = container.querySelector('div[style="height: 100%;"]');

        if (!sourcesContainer) {
            console.log('[ContentExtractor] Nie znaleziono kontenera źródeł [style="height: 100%;"]');
            return [];
        }

        console.log('[ContentExtractor] Znaleziono kontener źródeł:', sourcesContainer);

        const visibleSourceList = sourcesContainer.querySelector('ul[class]'); // Wybierz pierwszy ul, który ma atrybut class
        const links = visibleSourceList ? visibleSourceList.querySelectorAll('a[href]') : [];
        const sources = [];

        console.log(`[ContentExtractor] Znaleziono ${links.length} linków w widocznej liście źródeł`);

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

        console.log('[ContentExtractor] Unikalne źródła:', uniqueSources);
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

    extractSearchQuery() {
        try {
            const url = new URL(window.location.href);
            const query = url.searchParams.get('q');
            if (query) {
                // Dekoduj URL i zamień + na spacje
                const decodedQuery = decodeURIComponent(query.replace(/\+/g, ' '));
                console.log('[ContentExtractor] Znalezione słowo kluczowe:', decodedQuery);
                return decodedQuery;
            }
        } catch (e) {
            console.log('[ContentExtractor] Błąd przy wyciąganiu słowa kluczowego:', e);
        }
        return null;
    }
}
