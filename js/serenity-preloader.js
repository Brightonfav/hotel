// ===== SERENITY HAVEN UNIVERSAL PRELOADER =====
// Add this script to every page of your hotel website

console.log("Serenity Haven Universal Preloader Loading...");

// Configuration - Customize for different pages
const PRELOADER_CONFIG = {
    minLoadTime: 2000,      // Minimum time to show preloader (2 seconds for internal pages)
    maxLoadTime: 6000,      // Maximum time before auto-hide
    showPercentage: true,   // Show loading percentage
    showSkipButton: false,  // Hide skip button on internal pages
    customMessages: {
        // Page-specific loading messages (optional)
        'rooms': [
            "Preparing your rooms...",
            "Loading luxury suites...",
            "Setting up comfort...",
            "Ready for your stay..."
        ],
        'gallery': [
            "Loading beautiful memories...",
            "Preparing gallery...",
            "Setting up visuals...",
            "Almost ready..."
        ],
        'dining': [
            "Preparing culinary delights...",
            "Loading menu options...",
            "Setting up dining experience...",
            "Bon appétit..."
        ],
        'contact': [
            "Connecting you to us...",
            "Loading contact details...",
            "Setting up communication...",
            "Ready to assist..."
        ],
        'default': [
            "Loading Serenity Haven...",
            "Preparing your experience...",
            "Setting up luxury...",
            "Welcome to serenity..."
        ]
    }
};

// Auto-detect page type from URL or title
function getPageType() {
    const path = window.location.pathname.toLowerCase();
    const title = document.title.toLowerCase();
    
    if (path.includes('room') || title.includes('room')) return 'rooms';
    if (path.includes('gallery') || title.includes('gallery')) return 'gallery';
    if (path.includes('dining') || path.includes('restaurant') || title.includes('dining')) return 'dining';
    if (path.includes('contact') || title.includes('contact')) return 'contact';
    return 'default';
}

// Create preloader HTML and CSS
function createPreloader() {
    const pageType = getPageType();
    const messages = PRELOADER_CONFIG.customMessages[pageType];
    
    console.log(`Creating preloader for page type: ${pageType}`);

    // Create CSS
    const preloaderCSS = `
        <style id="preloader-styles">
            /* Preloader Styles */
            .serenity-preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'Georgia', serif;
            }

            .serenity-preloader.fade-out {
                opacity: 0;
                transform: scale(1.05);
                pointer-events: none;
            }

            .serenity-preloader * {
                box-sizing: border-box;
            }

            /* Background Effects */
            .preloader-bg-effects {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                opacity: 0.08;
            }

            .bg-circle {
                position: absolute;
                border: 1px solid #d4af37;
                border-radius: 50%;
                animation: preloaderFloat 10s ease-in-out infinite;
            }

            .bg-circle:nth-child(1) {
                width: 180px;
                height: 180px;
                top: 15%;
                left: 10%;
                animation-delay: 0s;
            }

            .bg-circle:nth-child(2) {
                width: 120px;
                height: 120px;
                top: 60%;
                right: 20%;
                animation-delay: 3s;
            }

            .bg-circle:nth-child(3) {
                width: 90px;
                height: 90px;
                bottom: 25%;
                left: 25%;
                animation-delay: 6s;
            }

            /* Logo Section */
            .preloader-logo {
                text-align: center;
                margin-bottom: 50px;
                position: relative;
                z-index: 2;
            }

            .preloader-title {
                font-size: 3.5rem;
                font-weight: 300;
                letter-spacing: 4px;
                color: #ffffff;
                margin-bottom: 15px;
                opacity: 0;
                animation: preloaderFadeInScale 1.5s ease 0.3s forwards;
            }

            .preloader-title span {
                color: #d4af37;
                font-weight: 400;
                animation: preloaderGoldPulse 3s ease-in-out infinite;
                position: relative;
            }

            .preloader-title span::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #d4af37, transparent);
                animation: preloaderUnderlineGlow 2.5s ease-in-out infinite;
            }

            .preloader-tagline {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 2px;
                text-transform: uppercase;
                opacity: 0;
                animation: preloaderFadeInUp 1.2s ease 0.6s forwards;
            }

            /* Loading Section */
            .preloader-loading {
                margin-top: 40px;
                position: relative;
                z-index: 2;
            }

            .preloader-loading-bar {
                width: 320px;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                position: relative;
                box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
            }

            .preloader-progress {
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(212, 175, 55, 0.4) 25%, 
                    #d4af37 50%, 
                    rgba(212, 175, 55, 0.4) 75%, 
                    transparent 100%);
                width: 100px;
                position: absolute;
                top: 0;
                left: -100px;
                animation: preloaderSlide 2.2s ease-in-out infinite;
            }

            .preloader-text {
                text-align: center;
                margin-top: 25px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.95rem;
                letter-spacing: 1px;
                opacity: 0;
                animation: preloaderFadeInUp 1.2s ease 0.9s forwards;
                transition: opacity 0.4s ease;
                min-height: 24px;
            }

            .preloader-percentage {
                display: block;
                margin-top: 12px;
                color: #d4af37;
                font-weight: 500;
                font-size: 1.1rem;
                opacity: 0;
                animation: preloaderFadeInUp 1.2s ease 1.1s forwards;
            }

            /* Particles */
            .preloader-particles {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                top: 0;
                left: 0;
                pointer-events: none;
            }

            .preloader-particle {
                position: absolute;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                animation: preloaderParticleFloat 7s ease-in-out infinite;
            }

            .preloader-particle:nth-child(1) { width: 5px; height: 5px; left: 20%; animation-delay: 0s; animation-duration: 6s; }
            .preloader-particle:nth-child(2) { width: 7px; height: 7px; left: 40%; animation-delay: 2s; animation-duration: 8s; }
            .preloader-particle:nth-child(3) { width: 4px; height: 4px; left: 60%; animation-delay: 4s; animation-duration: 5s; }
            .preloader-particle:nth-child(4) { width: 6px; height: 6px; left: 80%; animation-delay: 1s; animation-duration: 7s; }

            /* Skip Button */
            .preloader-skip {
                position: absolute;
                bottom: 30px;
                right: 30px;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: rgba(255, 255, 255, 0.7);
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 0.85rem;
                letter-spacing: 1px;
                transition: all 0.3s ease;
                opacity: 0;
                animation: preloaderFadeInUp 1s ease 1.5s forwards;
            }

            .preloader-skip:hover {
                background: rgba(212, 175, 55, 0.2);
                border-color: #d4af37;
                color: #d4af37;
                transform: translateY(-2px);
            }

            /* Animations */
            @keyframes preloaderFadeInScale {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes preloaderFadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes preloaderGoldPulse {
                0%, 100% {
                    color: #d4af37;
                    text-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
                }
                50% {
                    color: #e6c158;
                    text-shadow: 0 0 25px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.3);
                }
            }

            @keyframes preloaderUnderlineGlow {
                0%, 100% {
                    opacity: 0.4;
                    transform: scaleX(0.7);
                }
                50% {
                    opacity: 1;
                    transform: scaleX(1.2);
                }
            }

            @keyframes preloaderSlide {
                0% {
                    left: -100px;
                }
                100% {
                    left: 320px;
                }
            }

            @keyframes preloaderFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-15px) rotate(180deg);
                    opacity: 0.4;
                }
            }

            @keyframes preloaderParticleFloat {
                0% {
                    transform: translateY(100vh) scale(0);
                    opacity: 0;
                }
                10%, 90% {
                    opacity: 1;
                }
                25% {
                    transform: translateY(75vh) scale(1);
                }
                75% {
                    transform: translateY(-10vh) scale(1);
                }
                100% {
                    transform: translateY(-20vh) scale(0);
                    opacity: 0;
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .preloader-title {
                    font-size: 2.8rem;
                    letter-spacing: 3px;
                }
                
                .preloader-tagline {
                    font-size: 0.9rem;
                    letter-spacing: 1.5px;
                }
                
                .preloader-loading-bar {
                    width: 280px;
                }

                .preloader-skip {
                    bottom: 20px;
                    right: 20px;
                    padding: 8px 16px;
                    font-size: 0.8rem;
                }
            }

            @media (max-width: 480px) {
                .preloader-title {
                    font-size: 2.2rem;
                    letter-spacing: 2px;
                }
                
                .preloader-loading-bar {
                    width: 240px;
                }
            }
        </style>
    `;

    // Create HTML structure
    const preloaderHTML = `
        <div class="serenity-preloader" id="serenity-preloader">
            <!-- Background Effects -->
            <div class="preloader-bg-effects">
                <div class="bg-circle"></div>
                <div class="bg-circle"></div>
                <div class="bg-circle"></div>
            </div>

            <!-- Floating Particles -->
            <div class="preloader-particles">
                <div class="preloader-particle"></div>
                <div class="preloader-particle"></div>
                <div class="preloader-particle"></div>
                <div class="preloader-particle"></div>
            </div>

            <!-- Logo Section -->
            <div class="preloader-logo">
                <h1 class="preloader-title">Serenity <span>Haven</span></h1>
                <div class="preloader-tagline">Luxury • Comfort • Excellence</div>
            </div>

            <!-- Loading Section -->
            <div class="preloader-loading">
                <div class="preloader-loading-bar">
                    <div class="preloader-progress"></div>
                </div>
                <div class="preloader-text" id="preloader-text">Loading...</div>
                <span class="preloader-percentage" id="preloader-percentage">0%</span>
            </div>

            <!-- Skip Button (conditional) -->
            ${PRELOADER_CONFIG.showSkipButton ? '<button class="preloader-skip" id="preloader-skip">Skip</button>' : ''}
        </div>
    `;

    return { css: preloaderCSS, html: preloaderHTML };
}

// Main preloader class
class SerenityPreloader {
    constructor(config = {}) {
        this.config = { ...PRELOADER_CONFIG, ...config };
        this.startTime = Date.now();
        this.currentMessageIndex = 0;
        this.messageInterval = null;
        this.percentageInterval = null;
        this.pageType = getPageType();
        this.messages = this.config.customMessages[this.pageType];
        
        this.init();
    }

    init() {
        console.log(`Initializing Serenity Haven preloader for ${this.pageType} page`);
        
        // Create and inject preloader
        const { css, html } = createPreloader();
        
        // Add CSS to head
        document.head.insertAdjacentHTML('beforeend', css);
        
        // Add HTML to body
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Start animations
        this.startLoadingSequence();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    startLoadingSequence() {
        // Start message cycling
        setTimeout(() => {
            this.messageInterval = setInterval(() => {
                this.updateLoadingMessage();
            }, 1500);
        }, 1000);

        // Start percentage updates
        if (this.config.showPercentage) {
            this.percentageInterval = setInterval(() => {
                this.updatePercentage();
            }, 50);
        }

        // Auto-hide after minimum time
        setTimeout(() => {
            console.log("Minimum preloader time reached");
            this.hidePreloader();
        }, this.config.minLoadTime);

        // Fallback: auto-hide after maximum time
        setTimeout(() => {
            console.log("Maximum preloader time reached - force hiding");
            this.hidePreloader();
        }, this.config.maxLoadTime);
    }

    updateLoadingMessage() {
        const textEl = document.getElementById('preloader-text');
        if (textEl && this.currentMessageIndex < this.messages.length) {
            textEl.style.opacity = '0.5';
            setTimeout(() => {
                textEl.textContent = this.messages[this.currentMessageIndex];
                textEl.style.opacity = '1';
                this.currentMessageIndex++;
            }, 200);
        }
    }

    updatePercentage() {
        const percentageEl = document.getElementById('preloader-percentage');
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min((elapsed / this.config.minLoadTime) * 100, 100);
        
        if (percentageEl) {
            percentageEl.textContent = Math.floor(progress) + '%';
        }
        
        if (progress >= 100) {
            clearInterval(this.percentageInterval);
        }
    }

    setupEventListeners() {
        // Skip button (if enabled)
        const skipBtn = document.getElementById('preloader-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                console.log("Skip button clicked");
                this.hidePreloader();
            });
        }

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Optional: Double-click to skip (for testing)
        document.addEventListener('dblclick', (e) => {
            if (e.target.closest('.serenity-preloader')) {
                console.log("Double-click detected - skipping preloader");
                this.hidePreloader();
            }
        });
    }

    hidePreloader() {
        console.log("Hiding Serenity Haven preloader");
        
        // Clear intervals
        if (this.messageInterval) clearInterval(this.messageInterval);
        if (this.percentageInterval) clearInterval(this.percentageInterval);
        
        const preloader = document.getElementById('serenity-preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            
            setTimeout(() => {
                preloader.remove();
                document.body.style.overflow = 'auto';
                
                // Remove preloader styles
                const styles = document.getElementById('preloader-styles');
                if (styles) styles.remove();
                
                // Trigger custom event for other scripts
                window.dispatchEvent(new CustomEvent('serenityPreloaderComplete'));
                
                console.log("Preloader removed successfully");
            }, 800);
        }
    }

    pauseAnimations() {
        if (this.messageInterval) clearInterval(this.messageInterval);
        if (this.percentageInterval) clearInterval(this.percentageInterval);
    }

    resumeAnimations() {
        const preloader = document.getElementById('serenity-preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
            this.startLoadingSequence();
        }
    }
}

// Auto-initialize when DOM is ready
function initSerenityPreloader(customConfig = {}) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SerenityPreloader(customConfig);
        });
    } else {
        new SerenityPreloader(customConfig);
    }
}

// Default initialization
initSerenityPreloader();

// Make it globally available for custom configurations
window.SerenityPreloader = SerenityPreloader;
window.initSerenityPreloader = initSerenityPreloader;

console.log("Serenity Haven Universal Preloader script loaded successfully");

// ===== USAGE EXAMPLES =====
/*

// BASIC USAGE (Default settings):
// Just include this script in your HTML pages

// CUSTOM CONFIGURATION:
initSerenityPreloader({
    minLoadTime: 3000,
    showSkipButton: true,
    customMessages: {
        'custom': [
            "Your custom message 1...",
            "Your custom message 2...",
            "Ready!"
        ]
    }
});

// LISTEN FOR COMPLETION:
window.addEventListener('serenityPreloaderComplete', function() {
    console.log('Preloader finished - start your page scripts');
    // Initialize your page-specific JavaScript here
});

*/