/**
 * Motion Module
 * IntersectionObserver-based scroll reveal animations
 */

const REVEAL_SELECTOR = '.reveal:not(.reveal--visible)';
const STAGGER_SELECTOR = '.reveal-stagger > *';

export function initMotion() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Immediately reveal all elements
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--visible');
    });
    return;
  }

  // Main reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  // Stagger observer for grouped elements
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(':scope > *');
        children.forEach((child, index) => {
          child.style.animationDelay = `${index * 80}ms`;
          child.classList.add('reveal--visible');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  // Observe reveal elements
  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
    revealObserver.observe(el);
  });

  // Observe stagger containers
  document.querySelectorAll('.reveal-stagger').forEach(el => {
    staggerObserver.observe(el);
  });

  // Re-observe when new content is added (e.g., project modal)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.querySelectorAll?.(REVEAL_SELECTOR).forEach(el => {
            revealObserver.observe(el);
          });
          node.querySelectorAll?.('.reveal-stagger').forEach(el => {
            staggerObserver.observe(el);
          });
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Export for manual triggering
  window.revealElements = (container = document) => {
    container.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
      revealObserver.observe(el);
    });
  };
}

/**
 * Stagger animation utility
 * @param {Element} container - Parent element with children to stagger
 * @param {number} baseDelay - Base delay in ms
 * @param {number} increment - Delay increment per child in ms
 */
export function staggerChildren(container, baseDelay = 50, increment = 80) {
  const children = container.querySelectorAll(':scope > *');
  children.forEach((child, index) => {
    child.style.animationDelay = `${baseDelay + index * increment}ms`;
    child.classList.add('reveal--visible');
  });
}

/**
 * Manual reveal for dynamically added content
 */
export function revealElement(element) {
  if (element) {
    element.classList.add('reveal--visible');
  }
}