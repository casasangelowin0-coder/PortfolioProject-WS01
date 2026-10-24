/**
 * Theme Management Module
 * Handles dark/light mode toggle, persistence, and color scheme
 */

const THEME_KEY = 'portfolio-theme';
const THEME_ATTR = 'data-theme';

export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  localStorage.setItem(THEME_KEY, theme);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1d1d1f' : '#1a73e8');
  }

  // Dispatch custom event for other modules
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute(THEME_ATTR) || 'light';
}