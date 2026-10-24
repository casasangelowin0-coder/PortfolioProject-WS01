/**
 * Main Entry Point
 * Bootstraps all modules and handles global error boundary
 */

import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initContactForm } from './contact.js';
import { initMotion } from './motion.js';
import { initHeroNameSwipe } from './hero-swipe.js';
import { initWorldTime } from './world-time.js';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Core modules (order matters for dependencies)
    initTheme();
    initNavigation();

    // Content modules
    initContactForm();

    // Hero animation
    initHeroNameSwipe();
    initWorldTime();

    // Motion (last, observes other modules' content)
    initMotion();

    // Mark page as loaded for CSS transitions
    document.documentElement.classList.add('page-loaded');
  } catch (error) {
    console.error('Initialization error:', error);
  }
});