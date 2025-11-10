/**
 * Shared Header Loader
 * Loads the shared header component into pages
 * Template embedded to avoid CORS issues with local files
 */

(function() {
    'use strict';

    // Shared header HTML template
    const HEADER_TEMPLATE = `
<header class="border-b border-border/40 backdrop-blur-sm bg-background/30">
    <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg font-semibold text-foreground">OrderPay Training</h1>
                    <p class="text-xs text-muted-foreground">NCR Aloha Payment Solutions</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div class="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>v1.0.0</span>
                </div>

                <!-- Accessibility Toggle -->
                <button id="accessibility-button" class="p-2 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors" title="Accessibility options" aria-label="Accessibility options">
                    <!-- Sliders/settings icon -->
                    <svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="4" y1="8" x2="20" y2="8" stroke-width="2" stroke-linecap="round"/>
                        <line x1="4" y1="16" x2="20" y2="16" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="8" cy="8" r="2" fill="currentColor"/>
                        <circle cx="16" cy="16" r="2" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</header>

<!-- Accessibility Panel -->
<div id="accessibility-panel" class="accessibility-panel">
    <h3 class="text-lg font-semibold mb-4">Accessibility Options</h3>

    <!-- High Contrast Toggle -->
    <div class="accessibility-option">
        <label>High Contrast</label>
        <div class="toggle-switch" id="high-contrast-toggle"></div>
    </div>

    <!-- Font Size Radio Group -->
    <div class="accessibility-option">
        <label class="block mb-2 font-medium">Font Size</label>
        <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="font-size" value="normal" class="w-4 h-4 accent-primary cursor-pointer">
                <span class="text-sm">Normal</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="font-size" value="larger" class="w-4 h-4 accent-primary cursor-pointer">
                <span class="text-sm">Larger Text</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="font-size" value="largest" class="w-4 h-4 accent-primary cursor-pointer">
                <span class="text-sm">Largest Text</span>
            </label>
        </div>
    </div>
</div>
`;

    /**
     * Attach event listeners to header buttons
     */
    function attachEventListeners() {
        const accessBtn = document.getElementById('accessibility-button');
        const contrastToggle = document.getElementById('high-contrast-toggle');
        const fontRadios = document.querySelectorAll('input[name="font-size"]');

        if (accessBtn) {
            accessBtn.addEventListener('click', function() {
                if (typeof accessibilityManager !== 'undefined') {
                    accessibilityManager.togglePanel();
                }
            });
        }

        if (contrastToggle) {
            contrastToggle.addEventListener('click', function() {
                if (typeof accessibilityManager !== 'undefined') {
                    accessibilityManager.toggleHighContrast();
                }
            });
        }

        fontRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (typeof accessibilityManager !== 'undefined') {
                    accessibilityManager.setFontSize(this.value);
                    setTimeout(() => {
                        accessibilityManager.closePanel();
                    }, 300);
                }
            });
        });
    }

    /**
     * Load the shared header into the page
     */
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');

        if (!headerPlaceholder) {
            console.error('Header placeholder not found. Add <div id="header-placeholder"></div> to your page.');
            return;
        }

        try {
            // Insert the header template
            headerPlaceholder.innerHTML = HEADER_TEMPLATE;

            // Attach event listeners to header buttons
            attachEventListeners();

            // Dispatch custom event to signal header has loaded
            document.dispatchEvent(new CustomEvent('headerLoaded'));

            console.log('Header loaded successfully');

        } catch (error) {
            console.error('Error loading header:', error);
            // Fallback: show error message
            headerPlaceholder.innerHTML = `
                <div class="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                    <p class="font-semibold">Header failed to load</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
        }
    }

    // Load header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
