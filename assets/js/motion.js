const REVEAL_SELECTOR = '.reveal:not(.reveal--visible)';
export function initMotion() {
  const hero = document.querySelector('.hero');
  if (hero) {
    new IntersectionObserver(([e]) => {
      document.body.classList.toggle('is-offscreen', !e.isIntersecting);
    }).observe(hero);
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--visible');
    });
    return;
  }
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
  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
    revealObserver.observe(el);
  });
}
