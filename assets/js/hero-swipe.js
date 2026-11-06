const NAME_SWIPER_SELECTOR = '.hero__name-swipe';
const NAMES = ['Angelo Win Casas'];
const POP_IN_DURATION = 500;
const POP_OUT_DURATION = 400;
const HOLD_DURATION = 2500;
const GAP_DURATION = 400;
export function initHeroNameSwipe() {
  const element = document.querySelector(NAME_SWIPER_SELECTOR);
  if (!element) return;
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
  element.style.opacity = '0';
  element.style.transform = 'scale(0.5)';
  element.classList.remove('hero__name-swipe--static');
  function popIn(name) {
    element.textContent = name;
    element.classList.remove('hero__name-pop-out');
    element.classList.add('hero__name-pop-in');
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
    popIn(currentName);
    setTimeout(() => {
      popOut();
      setTimeout(() => {
        nameIndex++;
        isAnimating = false;
        animate();
      }, POP_OUT_DURATION + GAP_DURATION);
    }, POP_IN_DURATION + HOLD_DURATION);
  }
  animationId = setTimeout(animate, 800);
  return () => clearTimeout(animationId);
}