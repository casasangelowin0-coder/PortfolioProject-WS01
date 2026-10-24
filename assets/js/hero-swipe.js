/**
 * Hero Name Pop Animation Module
 * Name pops in and out with animated keyframes
 */

const NAME_SWIPER_SELECTOR = '.hero__name-swipe';
const NAMES = ['Angelo Win Casas']; // Add more names to cycle through if desired
const POP_IN_DURATION = 500; // ms
const POP_OUT_DURATION = 400; // ms
const HOLD_DURATION = 2500; // ms how long name stays visible
const GAP_DURATION = 400; // ms between pop-out and next pop-in

export function initHeroNameSwipe() {
  const element = document.querySelector(NAME_SWIPER_SELECTOR);
  if (!element) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    element.textContent = NAMES[0];
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
    element.classList.add('hero__name-swipe--static');
    return;
  }

  let nameIndex = 0;
  let animationId;
  let isAnimating = false;

  // Initial state - hidden
  element.style.opacity = '0';
  element.style.transform = 'scale(0.5)';
  element.classList.remove('hero__name-swipe--static');

  function popIn(name) {
    element.textContent = name;
    element.classList.remove('hero__name-pop-out');
    element.classList.add('hero__name-pop-in');
    // Force reflow
    element.offsetHeight;
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  }

  function popOut() {
    element.classList.remove('hero__name-pop-in');
    element.classList.add('hero__name-pop-out');
  }

  function animate() {
    if (isAnimating) return;
    isAnimating = true;

    const currentName = NAMES[nameIndex % NAMES.length];

    // Pop in
    popIn(currentName);

    // Hold then pop out
    setTimeout(() => {
      popOut();

      // Wait for pop-out to finish, then next
      setTimeout(() => {
        nameIndex++;
        isAnimating = false;
        animate();
      }, POP_OUT_DURATION + GAP_DURATION);

    }, POP_IN_DURATION + HOLD_DURATION);
  }

  // Start animation after a small delay
  animationId = setTimeout(animate, 800);

  // Cleanup
  return () => clearTimeout(animationId);
}