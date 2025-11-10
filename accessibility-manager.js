/**
 * Shared Accessibility Manager
 * Manages accessibility settings across all pages using localStorage
 * Handles: High Contrast, Larger Text, Largest Text
 */

class AccessibilityManager {
    constructor() {
        this.KEYS = {
            HIGH_CONTRAST: 'accessibility_highContrast',
            FONT_SIZE: 'accessibility_fontSize'
        };
        this.FONT_SIZES = {
            NORMAL: 'normal',
            LARGER: 'larger',
            LARGEST: 'largest'
        };
        this.init();
    }

    /**
     * Initialize accessibility settings on page load
     */
    init() {
        // Apply settings immediately (before body renders)
        this.applyStoredSettings();

        // Wait for DOM to update UI elements
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadHighContrast();
                this.loadFontSize();
            });
        } else {
            this.loadHighContrast();
            this.loadFontSize();
        }

        // Listen for header loaded event to update UI
        document.addEventListener('headerLoaded', () => {
            this.updateUIFromSettings();
        });
    }

    /**
     * Apply stored settings immediately (called before DOM ready)
     */
    applyStoredSettings() {
        // Apply font size to html element (works even if body doesn't exist yet)
        const savedSize = localStorage.getItem(this.KEYS.FONT_SIZE);
        const html = document.documentElement;

        if (savedSize === this.FONT_SIZES.LARGER) {
            html.classList.add('font-larger');
        } else if (savedSize === this.FONT_SIZES.LARGEST) {
            html.classList.add('font-largest');
        }

        // High contrast needs body, so we'll apply it in loadHighContrast after DOM ready
    }

    /**
     * Update UI to reflect current settings (called after header loads)
     */
    updateUIFromSettings() {
        // Update high contrast toggle
        const isHighContrast = document.body.classList.contains('high-contrast');
        this.updateToggleUI('high-contrast-toggle', isHighContrast);

        // Update font size radio buttons
        const savedSize = localStorage.getItem(this.KEYS.FONT_SIZE) || this.FONT_SIZES.NORMAL;
        this.updateFontSizeUI(savedSize);
    }

    /**
     * Toggle high contrast
     */
    toggleHighContrast() {
        const isActive = document.body.classList.toggle('high-contrast');
        localStorage.setItem(this.KEYS.HIGH_CONTRAST, isActive);
        this.updateToggleUI('high-contrast-toggle', isActive);
        return isActive;
    }

    /**
     * Set font size (normal, larger, or largest)
     */
    setFontSize(size) {
        const html = document.documentElement;

        // Remove all font size classes
        html.classList.remove('font-larger', 'font-largest');

        // Add the selected size class (Normal = no class, just baseline)
        if (size === this.FONT_SIZES.LARGER) {
            html.classList.add('font-larger');
        } else if (size === this.FONT_SIZES.LARGEST) {
            html.classList.add('font-largest');
        }
        // Normal: no class added = 100% baseline

        // Save to localStorage
        localStorage.setItem(this.KEYS.FONT_SIZE, size);

        // Update UI radio buttons
        this.updateFontSizeUI(size);

        return size;
    }

    /**
     * Load high contrast preference
     */
    loadHighContrast() {
        const saved = localStorage.getItem(this.KEYS.HIGH_CONTRAST);
        if (saved === 'true') {
            document.body.classList.add('high-contrast');
            this.updateToggleUI('high-contrast-toggle', true);
        }
    }

    /**
     * Load font size preference
     */
    loadFontSize() {
        const saved = localStorage.getItem(this.KEYS.FONT_SIZE) || this.FONT_SIZES.NORMAL;
        this.setFontSize(saved);
    }

    /**
     * Update toggle switch UI
     */
    updateToggleUI(toggleId, isActive) {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            if (isActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    }

    /**
     * Update font size radio buttons UI
     */
    updateFontSizeUI(size) {
        const radios = document.querySelectorAll('input[name="font-size"]');
        radios.forEach(radio => {
            radio.checked = (radio.value === size);
        });
    }

    /**
     * Toggle accessibility panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('accessibility-panel');
        if (panel) {
            const isShowing = panel.classList.toggle('show');

            if (isShowing) {
                // Add click outside listener
                setTimeout(() => {
                    document.addEventListener('click', this.handleClickOutside.bind(this));
                }, 10);
            } else {
                // Remove listener when closing
                document.removeEventListener('click', this.handleClickOutside.bind(this));
            }
        }
    }

    /**
     * Close panel when clicking outside
     */
    handleClickOutside(e) {
        const panel = document.getElementById('accessibility-panel');
        const button = document.getElementById('accessibility-button');

        if (panel && button && !panel.contains(e.target) && !button.contains(e.target)) {
            panel.classList.remove('show');
            document.removeEventListener('click', this.handleClickOutside.bind(this));
        }
    }

    /**
     * Close panel (called after selection)
     */
    closePanel() {
        const panel = document.getElementById('accessibility-panel');
        if (panel) {
            panel.classList.remove('show');
            document.removeEventListener('click', this.handleClickOutside.bind(this));
        }
    }
}

// Initialize accessibility manager IMMEDIATELY
const accessibilityManager = new AccessibilityManager();

// Global helper functions - explicitly attached to window
window.toggleAccessibilityPanel = function() {
    accessibilityManager.togglePanel();
};

window.toggleHighContrast = function() {
    accessibilityManager.toggleHighContrast();
};

window.setFontSize = function(size) {
    accessibilityManager.setFontSize(size);
    // Auto-close panel after selection
    setTimeout(() => {
        accessibilityManager.closePanel();
    }, 300);
};
