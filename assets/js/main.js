import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initContactForm } from './contact.js';
import { initMotion } from './motion.js';
import { initHeroNameSwipe } from './hero-swipe.js';
import { initWorldTime } from './world-time.js';
import { initCoinSound } from './coin-sound.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    [initTheme, initNavigation, initContactForm, initHeroNameSwipe, initWorldTime, initMotion, initCoinSound].forEach(fn => fn());
    document.documentElement.classList.add('page-loaded');
  } catch (error) {
    console.error('Initialization error:', error);
  }
});
