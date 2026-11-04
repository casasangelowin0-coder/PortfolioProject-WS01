const FLIP_SELECTOR = '.hero__avatar-flip';
const SOUND_SRC = 'assets/audio/coin-flip.mp3';
const VOLUME = 0.3;
const CYCLE_MS = 6000;
const FLIP_START_MS = CYCLE_MS * 0.58;
const ANIMATION_NAME = 'avatar-flip';
const MAX_FRAME_DELTA_MS = 250;

export function initCoinSound() {
  const element = document.querySelector(FLIP_SELECTOR);
  if (!element) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sound = new Audio(SOUND_SRC);
  sound.preload = 'auto';
  sound.volume = VOLUME;

  // The sound is attempted automatically on every flip, with no click needed.
  // If the browser's autoplay policy blocks it, play() is rejected silently and
  // the very next flip is attempted again; once the visitor interacts with the
  // page (or allows sound for the site), it starts playing on its own.
  function play() {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // Detect the moment each flip begins by watching the CSS animation's clock.
  let lastPhase = null;
  function tick() {
    // Pick the flip animation by name; theme changes add CSS transitions
    // to the same element and would otherwise be picked up by mistake.
    const anim = element.getAnimations().find(a => a.animationName === ANIMATION_NAME);
    if (anim && anim.playState === 'running' && !document.hidden
        && !document.body.classList.contains('is-offscreen')) {
      const phase = Number(anim.currentTime) % CYCLE_MS;
      const delta = phase - (lastPhase ?? phase);
      // Only count a normal forward step, never a jump or restart of the clock.
      if (lastPhase !== null && delta >= 0 && delta < MAX_FRAME_DELTA_MS
          && lastPhase < FLIP_START_MS && phase >= FLIP_START_MS) {
        play();
      }
      lastPhase = phase;
    } else {
      lastPhase = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
