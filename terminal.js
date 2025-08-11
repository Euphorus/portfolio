/**
 * Portfolio Website JavaScript
 * Optimized for performance and accessibility
 */

class PortfolioManager {
    constructor() {
        this.isLoaded = false;
        this.animationFrameId = null;
        this.intersectionObserver = null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Bind methods
        this.handleBubbleClick = this.handleBubbleClick.bind(this);
        this.handleSmoothScroll = this.handleSmoothScroll.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.addRandomMovement = this.addRandomMovement.bind(this);
        
        this.init();
    }

    /**
     * Initialize the portfolio
     */
    init() {
        // Show loading screen briefly
        this.showLoadingScreen();
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPortfolio());
        } else {
            this.setupPortfolio();
        }
    }

    /**
     * Show loading screen and hide after delay
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Hide loading screen after 1.5 seconds or when page is fully loaded
        const hideLoading = () => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        };

        // Hide after page load or timeout
        window.addEventListener('load', hideLoading);
        setTimeout(hideLoading, 1500);
    }

    /**
     * Setup all portfolio functionality
     */
    setupPortfolio() {
        this.createStars();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupAccessibility();
        
        if (!this.reducedMotion) {
            this.addRandomMovement();
        }
        
        this.isLoaded = true;
    }

    /**
     * Create animated stars in background
     */
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;

        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        const numberOfStars = this.reducedMotion ? 50 : 100;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            if (!this.reducedMotion) {
                star.style.animationDelay = `${Math.random() * 3}s`;
            }
            
            fragment.appendChild(star);
        }

        starsContainer.appendChild(fragment);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Bubble click handlers
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.addEventListener('click', this.handleBubbleClick);
            bubble.addEventListener('keydown', this.handleKeyboard);
            
            // Touch feedback for mobile
            if ('ontouchstart' in window) {
                bubble.addEventListener('touchstart', this.handleTouchStart, { passive: true });
                bubble.addEventListener('touchend', this.handleTouchEnd, { passive: true });
            }
        });

        // Smooth scrolling for navigation
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Keyboard navigation improvements
        document.addEventListener('keydown', this.handleGlobalKeyboard.bind(this));

        // Resize handler for responsive adjustments
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Visibility change handler for performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Handle bubble clicks
     */
    handleBubbleClick(event) {
        const bubble = event.currentTarget;
        const url = bubble.getAttribute('data-url');
        
        if (!url) return;

        // Add click animation
        bubble.style.transform = 'scale(0.95)';
        
        // Analytics tracking (if implemented)
        this.trackEvent('project_click', bubble.querySelector('.bubble-title').textContent);

        // Open URL after animation
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
            bubble.style.transform = '';
        }, 150);
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleBubbleClick(event);
        }
    }

    /**
     * Handle global keyboard shortcuts
     */
    handleGlobalKeyboard(event) {
        // Skip if user is typing in an input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case '1':
                event.preventDefault();
                this.scrollToSection('about');
                break;
            case '2':
                event.preventDefault();
                this.scrollToSection('projects');
                break;
            case '3':
                event.preventDefault();
                this.scrollToSection('contact');
                break;
        }
    }

    /**
     * Handle smooth scrolling
     */
    handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        this.scrollToSection(targetId.replace('#', ''));
    }

    /**
     * Scroll to a specific section
     */
    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update focus for accessibility
            target.tabIndex = -1;
            target.focus();
        }
    }

    /**
     * Handle touch start for mobile feedback
     */
    handleTouchStart(event) {
        const bubble = event.currentTarget;
        bubble.style.transform = 'scale(0.95)';
    }

    /**
     * Handle touch end for mobile feedback
     */
    handleTouchEnd(event) {
        const bubble = event.currentTarget;
        setTimeout(() => {
            bubble.style.transform = '';
        }, 100);
    }

    /**
     * Add random movement to bubbles (performance optimized)
     */
    addRandomMovement() {
        if (this.reducedMotion) return;

        const bubbles = document.querySelectorAll('.bubble');
        const movements = [];

        // Pre-calculate movements for better performance
        bubbles.forEach((bubble, index) => {
            movements[index] = {
                element: bubble,
                baseX: 0,
                baseY: 0,
                targetX: 0,
                targetY: 0,
                currentX: 0,
                currentY: 0,
                speed: 0.02 + Math.random() * 0.01
            };
        });

        const animateMovements = () => {
            movements.forEach(movement => {
                // Update target positions occasionally
                if (Math.random() < 0.001) {
                    movement.targetX = (Math.random() - 0.5) * 30;
                    movement.targetY = (Math.random() - 0.5) * 30;
                }

                // Smoothly interpolate to target
                movement.currentX += (movement.targetX - movement.currentX) * movement.speed;
                movement.currentY += (movement.targetY - movement.currentY) * movement.speed;

                // Apply transform
                movement.element.style.transform = 
                    `translate(${movement.currentX}px, ${movement.currentY}px)`;
            });

            this.animationFrameId = requestAnimationFrame(animateMovements);
        };

        // Start animation only when page is visible
        if (!document.hidden) {
            animateMovements();
        }
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections that should animate on scroll
        const animateElements = document.querySelectorAll('.skill-card, .bubble');
        animateElements.forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    /**
     * Setup accessibility enhancements
     */
    setupAccessibility() {
        // Add skip links functionality
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll);
        });

        // Enhance focus indicators
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // ARIA live region for dynamic updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate bubble positions if needed
        const bubbles = document.querySelectorAll('.bubble');
        const projectsArea = document.querySelector('.projects-area');
        
        if (!projectsArea) return;

        const areaRect = projectsArea.getBoundingClientRect();
        
        bubbles.forEach(bubble => {
            const bubbleRect = bubble.getBoundingClientRect();
            
            // Ensure bubbles stay within bounds
            if (bubbleRect.right > areaRect.right) {
                bubble.style.right = '10px';
                bubble.style.left = 'auto';
            }
            if (bubbleRect.bottom > areaRect.bottom) {
                bubble.style.bottom = '10px';
                bubble.style.top = 'auto';
            }
        });
    }

    /**
     * Handle visibility change for performance optimization
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        } else if (this.isLoaded && !this.reducedMotion) {
            // Resume animations when tab becomes visible
            this.addRandomMovement();
        }
    }

    /**
     * Analytics tracking (placeholder for actual implementation)
     */
    trackEvent(eventName, eventData) {
        // Implement your analytics tracking here
        console.log('Event tracked:', eventName, eventData);
        
        // Example for Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, {
        //         custom_parameter: eventData
        //     });
        // }
    }

    /**
     * Utility: Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Throttle function for performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Clean up when needed
     */
    destroy() {
        // Cancel any ongoing animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Disconnect intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        // Remove event listeners
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.removeEventListener('click', this.handleBubbleClick);
            bubble.removeEventListener('keydown', this.handleKeyboard);
        });
    }
}

/**
 * Utility functions that don't belong to the class
 */

/**
 * Lazy load images when they come into view
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Service Worker registration for PWA capabilities
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

/**
 * Initialize portfolio when DOM is ready
 */
const portfolio = new PortfolioManager();

/**
 * Setup additional optimizations
 */
document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();
    // registerServiceWorker(); // Uncomment if you create a service worker
});

/**
 * Export for module usage (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}