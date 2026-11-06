// Loading screen: stays up for one full loop of the animation (~2 s from page start)
// and until the page has finished loading, then fades out and removes itself.
const MIN_VISIBLE_MS = 2000;
const FAILSAFE_MS = 8000;

export function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minVisible = reduceMotion ? 0 : MIN_VISIBLE_MS;

  const hide = () => {
    if (loader.classList.contains('loader--done')) return;
    loader.classList.add('loader--done');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 1000);
  };

  const finish = () => {
    // performance.now() counts from the start of navigation
    setTimeout(hide, Math.max(0, minVisible - performance.now()));
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });

  setTimeout(hide, FAILSAFE_MS);
}
