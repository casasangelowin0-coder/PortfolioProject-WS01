/**
 * Main Entry Point
 * Bootstraps all modules and handles global error boundary
 */

import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initProjects } from './projects.js';
import { initContactForm } from './contact.js';
import { initMotion } from './motion.js';
import { initHeroNameSwipe } from './hero-swipe.js';
import { initWorldTime } from './world-time.js';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Could send to error tracking service here
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  // Could send to error tracking service here
});

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Core modules (order matters for dependencies)
    initTheme();
    initNavigation();

    // Content modules
    initProjects();
    initContactForm();

    // Hero animation
    initHeroNameSwipe();
    initWorldTime();

    // Motion (last, observes other modules' content)
    initMotion();

    // Mark page as loaded for CSS transitions
    document.documentElement.classList.add('page-loaded');

    console.log('Portfolio initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page hidden - could pause animations
  } else {
    // Page visible - could resume animations
  }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed - not critical
    });
  });
}